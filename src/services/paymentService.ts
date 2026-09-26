import { PaymentOrder, UserEntitlement, DigitalProduct } from '../types';
import { DbService } from './dbService';

export interface PaymentInitiationResult {
  order: PaymentOrder;
  paymentGatewayUrl?: string;
  gatewayParameters?: Record<string, string>;
  instructionsNe: string;
}

export class PaymentService {
  /**
   * 1. Create a secure payment order
   */
  static async createOrder(params: {
    userId: string;
    userEmail: string;
    userName: string;
    product: DigitalProduct;
    gateway: 'esewa' | 'khalti' | 'connect_ips' | 'manual_bank_transfer';
  }): Promise<PaymentOrder> {
    const order = DbService.createPaymentOrder({
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      productId: params.product.id,
      productTitle: params.product.titleNe,
      amountNpr: params.product.discountedPriceNpr,
      gateway: params.gateway,
      adminNotes: `Order for ${params.product.titleEn}`
    });
    return order;
  }

  /**
   * 2. Initiate Payment flow with selected provider
   */
  static async initiatePayment(order: PaymentOrder): Promise<PaymentInitiationResult> {
    if (order.gateway === 'manual_bank_transfer') {
      return {
        order,
        instructionsNe: 'कृपया तल दिइएको QR कोड स्क्यान गरी वा बैंक खातामा रकम जम्मा गरेर भौचर/ट्रान्ज्याक्सन आइडी अपलोड गर्नुहोस्। प्रशासकबाट प्रमाणीकरणपछि तपाईंको अध्ययन सामग्री तत्काल सुचारु हुनेछ।'
      };
    }

    if (order.gateway === 'esewa') {
      return {
        order,
        paymentGatewayUrl: 'https://epay.esewa.com.np/api/epay/main/v2/form',
        gatewayParameters: {
          amount: order.amountNpr.toString(),
          tax_amount: '0',
          total_amount: order.amountNpr.toString(),
          transaction_uuid: order.orderNumber,
          product_code: 'EPAYTEST',
          success_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/success`,
          failure_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/payment/failure`,
          signed_field_names: 'total_amount,transaction_uuid,product_code'
        },
        instructionsNe: 'eSewa पोर्टलमा सुरक्षित भुक्तानीका लागि रिडाइरेक्ट हुँदैछ।'
      };
    }

    if (order.gateway === 'khalti') {
      return {
        order,
        paymentGatewayUrl: 'https://a.khalti.com/api/v2/epayment/initiate/',
        instructionsNe: 'खल्ती वालेट मार्फत सुरक्षित भुक्तानी सुरु गरिँदैछ।'
      };
    }

    return {
      order,
      instructionsNe: 'ConnectIPS मार्फत बैंक खाताबाट सोझै भुक्तानी गर्नुहोस्।'
    };
  }

  /**
   * 3. Submit Manual Payment Verification (Receipt / Txn ID)
   */
  static async submitManualVerification(params: {
    orderId: string;
    transactionReference: string;
    receiptImageUrl?: string;
  }): Promise<boolean> {
    const orders = DbService.getPaymentOrders();
    const order = orders.find(o => o.id === params.orderId || o.orderNumber === params.orderId);
    if (!order) return false;

    order.transactionReference = params.transactionReference;
    order.receiptImageUrl = params.receiptImageUrl;
    order.status = 'pending_verification';

    // Also register into Admin Payment Verification table for review
    DbService.addPaymentVerification({
      userId: order.userId,
      userName: order.userName,
      userEmail: order.userEmail,
      amount: order.amountNpr,
      gateway: order.gateway === 'esewa' ? 'esewa' : order.gateway === 'khalti' ? 'khalti' : 'bank_transfer',
      transactionId: params.transactionReference,
      receiptImage: params.receiptImageUrl,
      noteTitle: order.productTitle
    });

    return true;
  }

  /**
   * 4. Verify Payment & Grant Entitlement
   */
  static async verifyAndGrantAccess(params: {
    orderId: string;
    transactionId: string;
    verifiedByAdmin?: boolean;
  }): Promise<{ success: boolean; entitlement?: UserEntitlement; message: string }> {
    const orders = DbService.getPaymentOrders();
    const order = orders.find(o => o.id === params.orderId || o.orderNumber === params.orderId);

    if (!order) {
      return { success: false, message: 'अर्डर फेला परेन।' };
    }

    // Require verified status or admin confirmation
    if (params.verifiedByAdmin) {
      order.status = 'completed';
      order.completedAt = new Date().toISOString();
      order.transactionReference = params.transactionId;

      const entitlement = DbService.grantEntitlement({
        userId: order.userId,
        productId: order.productId,
        productType: 'digital_book',
        orderId: order.id,
        source: 'purchase'
      });

      return {
        success: true,
        entitlement,
        message: 'भुक्तानी सफलतापूर्वक प्रमाणीकरण भयो। तपाईंको अध्ययन सामग्री लाइब्रेरीमा उपलब्ध छ।'
      };
    }

    return {
      success: false,
      message: 'भुक्तानी प्रमाणीकरण प्रक्रियामा छ। प्रशासक स्वीकृतिपछि तत्काल उपलब्ध हुनेछ।'
    };
  }
}
