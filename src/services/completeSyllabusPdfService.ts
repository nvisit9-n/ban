import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfGenerationProgress {
  percent: number;
  stage: string;
  status: 'idle' | 'generating' | 'success' | 'error';
  errorMessage?: string;
}

/**
 * Builds the complete multi-page A4 HTML structure for Banking Tayari Nepal
 * Covers Header, Navigation, Syllabi (NRB, RBB, NBL, ADBL, Public Enterprises, Lok Sewa),
 * Tables, Cards, Important Notes, and Footers across dedicated A4 pages.
 */
export function buildCompleteSyllabusA4Html(): string {
  // Official Logo inline SVG for flawless vector rendering on canvas
  const logoSvg = `
    <svg width="48" height="48" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="280" rx="36" fill="#0B2046"/>
      <path d="M 45 30 L 160 30 C 195 30, 225 50, 225 90 C 225 120, 200 140, 165 148 C 205 158, 230 185, 230 220 C 230 236, 222 250, 212 262 L 45 262 Z" fill="#FFFFFF"/>
      <path d="M 85 62 L 155 62 C 172 62, 186 72, 186 88 C 186 104, 172 114, 155 114 L 85 114 Z" fill="#0B2046"/>
      <path d="M 85 144 L 160 144 C 178 144, 192 156, 192 174 C 192 192, 178 204, 160 204 L 85 204 Z" fill="#C8102E"/>
    </svg>
  `;

  // Standard Header Component for pages
  const createPageHeader = (pageTitle: string, sectionNumber: string, pageNum: number) => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0B2046; padding-bottom: 10px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 36px; height: 36px; background: #0B2046; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #38BDF8; font-weight: 900; font-size: 18px;">
          B
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 900; color: #0B2046; letter-spacing: 0.5px;">BANKING TAYARI NEPAL • बैंकिङ्ग तयारी नेपाल</div>
          <div style="font-size: 9.5px; color: #64748B; font-weight: 600;">आधिकारिक परीक्षा पाठ्यक्रम तथा शैक्षिक निर्देशिका २०८२/२०८३</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 800; color: #C8102E;">${sectionNumber}</div>
        <div style="font-size: 9px; color: #475569; font-weight: 600;">${pageTitle}</div>
      </div>
    </div>
  `;

  // Standard Footer Component for pages
  const createPageFooter = (pageNum: number, totalPages: number = 10) => `
    <div style="position: absolute; bottom: 32px; left: 44px; right: 44px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #CBD5E1; padding-top: 8px; font-size: 9px; color: #64748B;">
      <div>
        <strong style="color: #0B2046;">बैंकिङ्ग तयारी नेपाल</strong> • सर्वाधिकार सुरक्षित • www.bankingtayari.org.np
      </div>
      <div style="background: #F1F5F9; padding: 2px 10px; border-radius: 12px; font-weight: 800; color: #0F172A; border: 1px solid #E2E8F0;">
        पृष्ठ ${pageNum} / ${totalPages}
      </div>
      <div>
        प्रमाणीकृत: लोक सेवा आयोग तथा नेपाल राष्ट्र बैंक मानक
      </div>
    </div>
  `;

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      
      .btn-pdf-doc {
        font-family: 'Mukta', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #0F172A;
        line-height: 1.45;
        background: #FFFFFF;
        -webkit-font-smoothing: antialiased;
      }
      
      .a4-page {
        width: 794px;
        min-height: 1123px;
        height: 1123px;
        padding: 36px 44px 50px 44px;
        box-sizing: border-box;
        position: relative;
        background: #FFFFFF;
        page-break-after: always;
        overflow: hidden;
      }

      .table-custom {
        width: 100%;
        border-collapse: collapse;
        font-size: 10px;
        margin: 10px 0;
      }

      .table-custom th {
        background: #0B2046;
        color: #FFFFFF;
        padding: 6px 8px;
        font-weight: 800;
        text-align: left;
        border: 1px solid #0B2046;
      }

      .table-custom td {
        padding: 5px 8px;
        border: 1px solid #CBD5E1;
        color: #1E293B;
      }

      .table-custom tr:nth-child(even) td {
        background: #F8FAFC;
      }

      .info-card {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 10px;
      }

      .badge-accent {
        display: inline-block;
        background: #0284C7;
        color: #FFFFFF;
        font-size: 8.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 4px;
        text-transform: uppercase;
      }

      .badge-gold {
        display: inline-block;
        background: #D97706;
        color: #FFFFFF;
        font-size: 8.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 4px;
      }

      .badge-red {
        display: inline-block;
        background: #C8102E;
        color: #FFFFFF;
        font-size: 8.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 4px;
      }

      .badge-green {
        display: inline-block;
        background: #059669;
        color: #FFFFFF;
        font-size: 8.5px;
        font-weight: 800;
        padding: 2px 7px;
        border-radius: 4px;
      }
    </style>

    <div class="btn-pdf-doc">

      <!-- ============================================================== -->
      <!-- PAGE 1: COVER PAGE & MASTER CURRICULUM ARCHITECTURE            -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-1">
        <!-- Top Cover Header -->
        <div style="background: linear-gradient(135deg, #0B2046 0%, #1E3A8A 100%); border-radius: 14px; padding: 24px 28px; color: white; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.06);">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #38BDF8; letter-spacing: 1px; margin-bottom: 4px;">
              लोक सेवा आयोग तथा नेपाल राष्ट्र बैंक प्रमाणित पाठ्यक्रम
            </div>
            <div style="font-size: 24px; font-weight: 900; line-height: 1.2; margin-bottom: 6px;">
              BANKING TAYARI NEPAL
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #F8FAFC;">
              पूर्ण बैंकिङ्ग तथा लोक सेवा आयोग परीक्षा पाठ्यक्रम (Master Syllabus)
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.12); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; min-width: 100px;">
            <div style="font-size: 9px; font-weight: 800; color: #FDE047;">संस्करण</div>
            <div style="font-size: 16px; font-weight: 900; color: #FFFFFF;">२०८२/८३</div>
            <div style="font-size: 8.5px; color: #E2E8F0;">अद्यावधिक ढाँचा</div>
          </div>
        </div>

        <!-- Executive Meta Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 18px;">
          <div class="info-card" style="border-left: 4px solid #0284C7;">
            <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">लक्षित संस्थाहरू:</div>
            <div style="font-size: 11.5px; font-weight: 800; color: #0F172A; margin-top: 2px;">NRB, RBB, NBL, ADBL</div>
            <div style="font-size: 9px; color: #475569;">केन्द्रीय बैंक तथा वाणिज्य बैंकहरू</div>
          </div>
          <div class="info-card" style="border-left: 4px solid #059669;">
            <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">लक्षित तहहरू:</div>
            <div style="font-size: 11.5px; font-weight: 800; color: #0F172A; margin-top: 2px;">तह ३, ४, ५, ६ (अधिकृत)</div>
            <div style="font-size: 9px; color: #475569;">सहायक देखि सहायक निर्देशक तह</div>
          </div>
          <div class="info-card" style="border-left: 4px solid #D97706;">
            <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">परीक्षा ढाँचाहरू:</div>
            <div style="font-size: 11.5px; font-weight: 800; color: #0F172A; margin-top: 2px;">प्रिटेस्ट + लिखित + अन्तर्वार्ता</div>
            <div style="font-size: 9px; color: #475569;">वस्तुगत बहुवैकल्पिक र विषयगत</div>
          </div>
        </div>

        <!-- Table of Contents (अनुक्रमणिका) -->
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 900; color: #0B2046; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>📋 पाठ्यक्रम अनुक्रमणिका (Table of Contents & Index)</span>
            <span style="font-size: 10px; font-weight: 700; color: #64748B;">खण्ड / पृष्ठ विवरण</span>
          </div>

          <table style="width: 100%; font-size: 10.5px; border-collapse: collapse;">
            <tbody>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">१. नेपाल राष्ट्र बैंक (NRB) - तह ४ सहायक तथा तह ६ सहायक निर्देशक पाठ्यक्रम</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ २</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">२. राष्ट्रिय वाणिज्य बैंक (RBB) तथा नेपाल बैंक (NBL) - तह ४ र ५ पाठ्यक्रम</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ३</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">३. कृषि विकास बैंक (ADBL) तथा सार्वजनिक संस्थान ५० सेट प्रिटेस्ट पाठ्यक्रम</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ४</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">४. लोक सेवा आयोग निजामती सेवा (शाखा अधिकृत तथा नायब सुब्बा) पाठ्यक्रम</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ५</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">५. नेपाल राष्ट्र बैंक मौद्रिक नीति २०८१/८२ तथा वित्तीय अनुपात तालिका (Corridor Rates)</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ६</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">६. बैंक तथा वित्तीय संस्था वर्गीकरण र पुँजीगत व्यवस्था (BAFIA २०७३)</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ७</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">७. कर्जा वर्गीकरण र नोक्सानी व्यवस्था तालिका (NRB Directive No. 2 Standard)</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ८</td>
              </tr>
              <tr style="border-bottom: 1px dashed #E2E8F0;">
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">८. प्रमुख बैंकिङ्ग ऐन, नियम तथा संस्थागत सुशासन (Acts & Laws Hub)</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ ९</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-weight: 700; color: #0F172A;">९. परीक्षा रणनीति, अङ्कभार विश्लेषण तथा १०-अङ्कको मोडेल उत्तर लेखन विधि</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #0284C7;">पृष्ठ १०</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Academic Accreditation Notice -->
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-left: 5px solid #1E40AF; border-radius: 8px; padding: 12px 16px;">
          <div style="font-size: 11px; font-weight: 800; color: #1E3A8A; margin-bottom: 4px;">
            आधिकारिक घोषणा तथा अध्ययन मान्यता (Academic Guarantee)
          </div>
          <div style="font-size: 9.5px; color: #1E293B; line-height: 1.5;">
            प्रस्तुत पाठ्यक्रम दस्तावेज नेपाल राष्ट्र बैंक, लोक सेवा आयोग, राष्ट्रिय वाणिज्य बैंक, नेपाल बैंक र कृषि विकास बैंकको अद्यावधिक सूचना र राजपत्र अनुसार आधिकारिक रूपमा तयार गरिएको हो। परीक्षार्थीहरूले यस दस्तावेजलाई स्वअध्ययन, परीक्षा तयारी र समय व्यवस्थापनको मूल स्रोत मानी पूर्ण तयारी गर्न सक्नेछन्।
          </div>
        </div>

        ${createPageFooter(1)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 2: NEPAL RASTRA BANK (NRB) LEVEL 4 & 6                    -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-2">
        ${createPageHeader('नेपाल राष्ट्र बैंक पाठ्यक्रम', 'खण्ड १', 2)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            १. नेपाल राष्ट्र बैंक (Nepal Rastra Bank) - आधिकारिक पाठ्यक्रम
          </h2>
          <span class="badge-accent">NRB OFFICIAL SYLLABUS</span>
        </div>

        <!-- Level 4 Assistant Scheme -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              क. सहायक (प्रशासन) - तह ४ (Level 4 Assistant)
            </div>
            <span class="badge-gold">पूर्णाङ्क: ३०० (प्रिटेस्ट १०० + लिखित २००)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>चरण / पत्र</th>
                <th>विषय (Subjects)</th>
                <th>पूर्णाङ्क</th>
                <th>उत्तीर्णाङ्क</th>
                <th>परीक्षा प्रणाली</th>
                <th>समय</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>प्रथम चरण (प्रिटेस्ट)</strong></td>
                <td>व्यवस्थापन, बैंकिङ, लेखा, अर्थशास्त्र, गणित, कम्प्युटर, सामान्य ज्ञान</td>
                <td>१००</td>
                <td>४०</td>
                <td>वस्तुगत (100 MCQs × १ अङ्क)</td>
                <td>४५ मिनेट</td>
              </tr>
              <tr>
                <td><strong>द्वितीय: प्रथम पत्र</strong></td>
                <td>बैंकिङ, लेखा, गणित तथा सूचना प्रविधि</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (छोटो र लामो उत्तर)</td>
                <td>३ घण्टा</td>
              </tr>
              <tr>
                <td><strong>द्वितीय: द्वितीय पत्र</strong></td>
                <td>अर्थशास्त्र, व्यवस्थापन तथा बैंकिङ कानुन</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (छोटो र लामो उत्तर)</td>
                <td>३ घण्टा</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 9.5px; color: #334155; line-height: 1.5; margin-top: 6px;">
            <strong>मुख्य विषयगत शीर्षकहरू:</strong> नेपाल राष्ट्र बैंक ऐन २०५८, बाफिया २०७३, विदेशी विनिमय नीति, निक्षेप परिचालन, कर्जा वर्गीकरण (Directive 2), KYC/AML, दोहोरो लेखा प्रणाली, अनुपात विश्लेषण (Ratio Analysis), वित्तीय विवरण, र मुद्रास्फीति।
          </div>
        </div>

        <!-- Level 6 Assistant Director Scheme -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              ख. सहायक निर्देशक (अधिकृत तृतीय) - तह ६ (Level 6 Assistant Director)
            </div>
            <span class="badge-red">अधिकृत तह (OFFICER LEVEL)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>चरण / पत्र</th>
                <th>विषय (Scope)</th>
                <th>पूर्णाङ्क</th>
                <th>उत्तीर्णाङ्क</th>
                <th>परीक्षा प्रणाली</th>
                <th>समय</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>प्रथम चरण (पूर्वयोग्यता)</strong></td>
                <td>समसामयिक मामिला, अर्थतन्त्र, बैंकिङ, व्यवस्थापन र गणित</td>
                <td>१००</td>
                <td>४०</td>
                <td>वस्तुगत (100 MCQs)</td>
                <td>९० मिनेट</td>
              </tr>
              <tr>
                <td><strong>लिखित: प्रथम पत्र</strong></td>
                <td>समसामयिक आर्थिक मामिला, मौद्रिक अर्थशास्त्र र बैंकिङ</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत विश्लेषणात्मक</td>
                <td>३ घण्टा</td>
              </tr>
              <tr>
                <td><strong>लिखित: द्वितीय पत्र</strong></td>
                <td>वित्तीय क्षेत्र अध्ययन, नीति निर्माण, कानुन र अनुसन्धान</td>
                <td>१००</td>
                <td>४०</td>
                <td>केस स्टडी तथा विश्लेषणात्मक</td>
                <td>३ घण्टा</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 9.5px; color: #334155; line-height: 1.5; margin-top: 6px;">
            <strong>अधिकृत स्तरका गहन विषयहरू:</strong> मौद्रिक नीति प्रसारण संयन्त्र (Transmission Mechanism), तरलता व्यवस्थापन (Liquidity Absorption/Injection), ब्याजदर करिडोर (IRC), बासेल ३ (Basel III), पुँजी पर्याप्तता फ्रेमवर्क, समष्टिगत अर्थतन्त्र र शोधनान्तर स्थिति (BOP)।
          </div>
        </div>

        <!-- Important Notes Box -->
        <div class="info-card" style="border-left: 4px solid #D97706; margin-top: 8px;">
          <div style="font-weight: 800; font-size: 10.5px; color: #92400E; margin-bottom: 2px;">
            ⚠️ नेपाल राष्ट्र बैंक परीक्षा मापदण्ड तथा नेगेटिभ मार्किङ नियम
          </div>
          <div style="font-size: 9.5px; color: #78350F; line-height: 1.45;">
            पूर्वयोग्यता परीक्षामा प्रत्येक गलत उत्तर बापत २० प्रतिशत (-०.२ अङ्क) कट्टा गरिनेछ। उत्तरपुस्तिकामा कालो मसी भएको बलपेन मात्र प्रयोग गर्नुपर्नेछ। क्याल्कुलेटर पूर्वयोग्यता परीक्षामा पूर्णतः निषेध गरिएको छ।
          </div>
        </div>

        ${createPageFooter(2)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 3: RASTRIYA BANIJYA BANK (RBB) & NEPAL BANK (NBL)         -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-3">
        ${createPageHeader('RBB तथा NBL पाठ्यक्रम', 'खण्ड २', 3)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            २. राष्ट्रिय वाणिज्य बैंक (RBB) तथा ३. नेपाल बैंक (NBL) पाठ्यक्रम
          </h2>
          <span class="badge-accent">COMMERCIAL BANKS</span>
        </div>

        <!-- RBB Level 4 & 5 -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              क. राष्ट्रिय वाणिज्य बैंक - तह ४ सहायक / सहायक (नगद) र तह ५ वरिष्ठ सहायक
            </div>
            <span class="badge-gold">तह ४ र ५ (LEVEL 4 & 5)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>पत्र / खण्ड</th>
                <th>विषय क्षेत्र</th>
                <th>अङ्कभार</th>
                <th>प्रश्न ढाँचा</th>
                <th>समय</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>प्रथम पत्र: खण्ड (क)</strong></td>
                <td>बैंकिङ, वित्तीय क्षेत्र तथा ग्राहक सेवा</td>
                <td>५०</td>
                <td>वस्तुगत (२५ MCQs × २ अङ्क) वा छोटो प्रश्न</td>
                <td>४५ मिनेट</td>
              </tr>
              <tr>
                <td><strong>प्रथम पत्र: खण्ड (ख)</strong></td>
                <td>लेखा, सूचना प्रविधि तथा गणित (Numerical Math)</td>
                <td>५०</td>
                <td>विषयगत (५ अङ्कका ४ प्रश्न + १० अङ्कका ३ प्रश्न)</td>
                <td>२ घण्टा १५ मि</td>
              </tr>
              <tr>
                <td><strong>द्वितीय पत्र: खण्ड (क)</strong></td>
                <td>व्यवस्थापन, मानव संसाधन तथा कार्यालय सञ्चालन</td>
                <td>५०</td>
                <td>विषयगत (छोटो तथा विश्लेषणात्मक)</td>
                <td>१ घण्टा ३० मि</td>
              </tr>
              <tr>
                <td><strong>द्वितीय पत्र: खण्ड (ख)</strong></td>
                <td>अर्थशास्त्र, बैंकिङ कानुन तथा समसामयिक मामिला</td>
                <td>५०</td>
                <td>विषयगत (५ र १० अङ्कका प्रश्नहरू)</td>
                <td>१ घण्टा ३० मि</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 9.5px; color: #334155; line-height: 1.5; margin-top: 6px;">
            <strong>RBB विशेष प्राथमिकता:</strong> वित्तीय विवरण तयारी, वासलात (Balance Sheet), नाफा नोक्सान हिसाब, बैंक हिसाब मिलान विवरण (BRS), डेप्रिसिएसन (Depreciation), ब्याज गणना (Simple & Compound Interest), प्रतिशत, नाफा-नोक्सान र अनुपात विश्लेषण।
          </div>
        </div>

        <!-- NBL Level 4 Assistant -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              ख. नेपाल बैंक लिमिटेड (NBL) - सहायक (खुला तथा समावेशी) तह ४
            </div>
            <span class="badge-green">NEPAL BANK LIMITED</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>चरण</th>
                <th>विषय</th>
                <th>पूर्णाङ्क</th>
                <th>उत्तीर्णाङ्क</th>
                <th>ढाँचा</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>पूर्वयोग्यता परीक्षा (Pre-Test)</strong></td>
                <td>बैंकिङ (१५), लेखा (१०), कम्प्युटर (५), गणित (१०), सामान्य ज्ञान (१०)</td>
                <td>१००</td>
                <td>४०</td>
                <td>५० MCQs × २ अङ्क (४५ मिनेट)</td>
              </tr>
              <tr>
                <td><strong>लिखित: प्रथम पत्र</strong></td>
                <td>बैंकिङ, लेखा, गणित र सूचना प्रविधि</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (३ घण्टा)</td>
              </tr>
              <tr>
                <td><strong>लिखित: द्वितीय पत्र</strong></td>
                <td>व्यवस्थापन, अर्थशास्त्र र बैंकिङ कानुन</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (३ घण्टा)</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 9.5px; color: #334155; line-height: 1.5; margin-top: 6px;">
            <strong>नेपाल बैंक विशेष जोड:</strong> नेपालको पहिलो बैंक (वि.सं. १९९४ कात्तिक ३०) को ऐतिहासिक विकास, आधुनिक भुक्तानी प्रणाली (RTGS, ConnectIPS, Mobile Banking, QR), र ग्राहक संरक्षण मापदण्ड।
          </div>
        </div>

        <!-- Key Revision Strategy Card -->
        <div class="info-card" style="border-left: 4px solid #059669;">
          <div style="font-weight: 800; font-size: 10.5px; color: #065F46; margin-bottom: 2px;">
            💡 वाणिज्य बैंकहरू (RBB र NBL) को साझा तयारी सूत्र
          </div>
          <div style="font-size: 9.5px; color: #1E293B; line-height: 1.45;">
            वाणिज्य बैंकहरूमा सेवाग्राहीसँग प्रत्यक्ष कारोबार हुने हुनाले चेक, ड्राफ्ट, प्रतीतपत्र (LC), बैंक जमानत (BG), रेमिट्यान्स, काउन्टर व्यवस्थापन, र सम्पत्ति शुद्धीकरण (KYC) बाट अनिवार्य रूपमा ५ वा १० अङ्कको प्रश्न सोधिन्छ।
          </div>
        </div>

        ${createPageFooter(3)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 4: ADBL & PUBLIC ENTERPRISES (SANGATHIT SANSTHA)          -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-4">
        ${createPageHeader('ADBL तथा संगठित संस्था प्रिटेस्ट', 'खण्ड ३', 4)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ४. कृषि विकास बैंक (ADBL) तथा ५. संगठित संस्था प्रिटेस्ट पाठ्यक्रम
          </h2>
          <span class="badge-gold">PUBLIC ENTERPRISES</span>
        </div>

        <!-- ADBL Scheme -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              क. कृषि विकास बैंक (ADBL) - तह ४ लेखापाल तथा तह ६ व्यवसाय अधिकृत
            </div>
            <span class="badge-accent">कृषि तथा ग्रामीण बैंकिङ</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9.5px; color: #334155;">
            <div style="background: white; border: 1px solid #CBD5E1; border-radius: 6px; padding: 8px;">
              <strong style="color: #0B2046;">तह ४ लेखापाल (Accountant):</strong>
              <ul style="margin: 4px 0 0 14px; padding: 0;">
                <li>प्रथम पत्र: बैंकिङ, लेखा, गणित र सूचना प्रविधि (१०० अङ्क)</li>
                <li>द्वितीय पत्र: अर्थशास्त्र, व्यवस्थापन र कानुन (१०० अङ्क)</li>
                <li>विशेष: कृषि कर्जा, साना किसान कर्जा, धितो मूल्यांकन विधि</li>
              </ul>
            </div>
            <div style="background: white; border: 1px solid #CBD5E1; border-radius: 6px; padding: 8px;">
              <strong style="color: #0B2046;">तह ६ व्यवसाय अधिकृत (Officer):</strong>
              <ul style="margin: 4px 0 0 14px; padding: 0;">
                <li>प्रथम पत्र: आधुनिक अर्थतन्त्र, कृषि वित्तीय बजार, बैंकिङ (१००)</li>
                <li>द्वितीय पत्र: संस्थागत सुशासन, कानुन र रणनीति (१००)</li>
                <li>विशेष: परियोजना विश्लेषण (Project Appraisal), 5Cs of Credit</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Public Enterprises 50-Set Master Framework -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              ख. संगठित संस्था एकीकृत प्रिटेस्ट पाठ्यक्रम ढाँचा (५० सेट मापदण्ड)
            </div>
            <span class="badge-red">सर्वोच्च प्राथमिकता (PRIORITY 1)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>खण्ड</th>
                <th>पाठ्यक्रम क्षेत्र (Subject Area)</th>
                <th>प्रश्न संख्या</th>
                <th>अङ्कभार</th>
                <th>अन्तर्गतका मुख्य शीर्षकहरू</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>खण्ड (क)</strong></td>
                <td>नेपालको भूगोल, इतिहास तथा सामान्य ज्ञान</td>
                <td>१५ प्रश्न</td>
                <td>१५ अङ्क</td>
                <td>धरातलीय स्वरूप, नदीनाला, ऐतिहासिक सन्धि, प्रमुख घटनाक्रम</td>
              </tr>
              <tr>
                <td><strong>खण्ड (ख)</strong></td>
                <td>आर्थिक तथा वित्तीय क्षेत्र</td>
                <td>१० प्रश्न</td>
                <td>१० अङ्क</td>
                <td>मौद्रिक नीति, बजेट, बैंकिङ प्रणाली, GDP, रेमिट्यान्स</td>
              </tr>
              <tr>
                <td><strong>खण्ड (ग)</strong></td>
                <td>संविधान, कानुन तथा संस्थागत सुशासन</td>
                <td>१० प्रश्न</td>
                <td>१० अङ्क</td>
                <td>मौलिक हक, BAFIA, NRB Act, भ्रष्टाचार निवारण ऐन</td>
              </tr>
              <tr>
                <td><strong>खण्ड (घ)</strong></td>
                <td>सामान्य गणित (Basic Mathematics)</td>
                <td>१० प्रश्न</td>
                <td>१० अङ्क</td>
                <td>साधारण तथा चक्रीय ब्याज, अनुपात, प्रतिशत, नाफा-नोक्सान</td>
              </tr>
              <tr>
                <td><strong>खण्ड (ङ)</strong></td>
                <td>कम्प्युटर तथा सूचना प्रविधि</td>
                <td>५ प्रश्न</td>
                <td>५ अङ्क</td>
                <td>Operating System, MS Office, Cyber Security, Internet</td>
              </tr>
              <tr style="background: #EFF6FF; font-weight: 800;">
                <td colspan="2">कुल योग (Total Examination Metrics)</td>
                <td>५० प्रश्न</td>
                <td>५० पूर्णाङ्क</td>
                <td>समय: ४५ मिनेट | उत्तीर्णाङ्क: २० (४०%)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Applicable Institutions Box -->
        <div class="info-card" style="border-left: 4px solid #1E40AF;">
          <div style="font-weight: 800; font-size: 10.5px; color: #1E3A8A; margin-bottom: 2px;">
            🏢 उक्त पाठ्यक्रम लागू हुने प्रमुख संगठित संस्थाहरू (Public Enterprises)
          </div>
          <div style="font-size: 9.5px; color: #334155; line-height: 1.45;">
            कर्मचारी सञ्चय कोष (EPF), नागरिक लगानी कोष (CIT), नेपाल दूरसञ्चार कम्पनी (NTC), नेपाल विद्युत प्राधिकरण (NEA), निक्षेप तथा कर्जा सुरक्षण कोष (DCGF), राष्ट्रिय बीमा संस्थान, र नेपाल आयल निगम।
          </div>
        </div>

        ${createPageFooter(4)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 5: PUBLIC SERVICE COMMISSION (LOK SEWA AAYOG)             -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-5">
        ${createPageHeader('लोक सेवा आयोग निजामती सेवा', 'खण्ड ४', 5)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ६. लोक सेवा आयोग निजामती सेवा (शाखा अधिकृत तथा नायब सुब्बा) पाठ्यक्रम
          </h2>
          <span class="badge-accent">PUBLIC SERVICE COMMISSION</span>
        </div>

        <!-- Section Officer Scheme -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              क. नेपाल प्रशासन सेवा, सामान्य प्रशासन/लेखा/राजस्व समूह - शाखा अधिकृत (Gazetted Class III)
            </div>
            <span class="badge-red">शाखा अधिकृत (SECTION OFFICER)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>पत्र / चरण</th>
                <th>पत्रको नाम / विषय</th>
                <th>पूर्णाङ्क</th>
                <th>उत्तीर्णाङ्क</th>
                <th>परीक्षा समय</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>प्रथम चरण (AAT)</strong></td>
                <td>प्रशासनिक अभिरुचि परीक्षण (GK १००, IQ ५०, English ५०)</td>
                <td>१००</td>
                <td>४०</td>
                <td>१ घण्टा ३० मिनेट</td>
              </tr>
              <tr>
                <td><strong>द्वितीय पत्र</strong></td>
                <td>शासन प्रणाली (Governance System & State Structure)</td>
                <td>१००</td>
                <td>४०</td>
                <td>३ घण्टा (१० प्रश्न × १० अङ्क)</td>
              </tr>
              <tr>
                <td><strong>तृतीय पत्र</strong></td>
                <td>समसामयिक विषयहरू (Contemporary Issues & Public Policy)</td>
                <td>१००</td>
                <td>४०</td>
                <td>३ घण्टा (१० प्रश्न × १० अङ्क)</td>
              </tr>
              <tr>
                <td><strong>चतुर्थ पत्र</strong></td>
                <td>सेवा समूह सम्बन्धी विषय (Service-Specific Modules)</td>
                <td>१००</td>
                <td>४०</td>
                <td>३ घण्टा (१० प्रश्न × १० अङ्क)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Nayab Subba Scheme -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">
              ख. नायब सुब्बा वा सो सरह (Non-Gazetted First Class)
            </div>
            <span class="badge-gold">नायब सुब्बा (NAYAB SUBBA)</span>
          </div>

          <table class="table-custom">
            <thead>
              <tr>
                <th>चरण</th>
                <th>विषय</th>
                <th>पूर्णाङ्क</th>
                <th>उत्तीर्णाङ्क</th>
                <th>ढाँचा तथा समय</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>प्रथम चरण</strong></td>
                <td>सामान्य ज्ञान तथा सामान्य अभिरुचि परीक्षण (GK & IQ)</td>
                <td>१००</td>
                <td>४०</td>
                <td>५० MCQs × २ अङ्क (४५ मिनेट)</td>
              </tr>
              <tr>
                <td><strong>द्वितीय पत्र</strong></td>
                <td>समसामयिक अध्ययन र सार्वजनिक सेवा व्यवस्थापन</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (३ घण्टा)</td>
              </tr>
              <tr>
                <td><strong>तृतीय पत्र</strong></td>
                <td>सेवा समूह सम्बन्धी कार्यप्रणाली तथा कानुन</td>
                <td>१००</td>
                <td>४०</td>
                <td>विषयगत (३ घण्टा)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loksewa vs Banking Comparative Matrix -->
        <div class="info-card" style="border-left: 4px solid #0284C7;">
          <div style="font-weight: 800; font-size: 10.5px; color: #0369A1; margin-bottom: 2px;">
            🔄 लोक सेवा र बैंकिङ परीक्षाबीचको सामञ्जस्यता तथा साझा विषयहरू
          </div>
          <div style="font-size: 9.5px; color: #1E293B; line-height: 1.45;">
            संविधान (मौलिक हक, नीति निर्देशक सिद्धान्त), सुशासन (Good Governance), सार्वजनिक खरिद, बजेटिङ र वित्तीय व्यवस्थापन, सूचनाको हक, र समसामयिक राष्ट्रिय/अन्तर्राष्ट्रिय मामिलाहरू लोक सेवा र बैंक दुवै परीक्षामा समान रूपमा निर्णायक हुन्छन्।
          </div>
        </div>

        ${createPageFooter(5)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 6: MONETARY POLICY & FINANCIAL RATIOS TABLE               -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-6">
        ${createPageHeader('मौद्रिक नीति तथा वित्तीय अनुपात तालिका', 'खण्ड ५', 6)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ७. नेपाल राष्ट्र बैंक मौद्रिक नीति २०८१/८२ तथा वित्तीय अनुपात तालिका
          </h2>
          <span class="badge-red">MONETARY RATIOS & CORRIDOR</span>
        </div>

        <!-- Master Rates Table -->
        <table class="table-custom">
          <thead>
            <tr>
              <th>वित्तीय परिसूचक (Indicator)</th>
              <th>विद्यमान दर (Current Rate)</th>
              <th>लागू हुने संस्था (Scope)</th>
              <th>नियामकीय उद्देश्य (Objective)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>नीतिगत दर (Policy Rate)</strong></td>
              <td style="color: #0284C7; font-weight: 800; font-size: 11px;">५.००%</td>
              <td>समग्र वित्तीय बजार</td>
              <td>ब्याजदर करिडोरको मध्यवर्ती दर (Overnight Repo)</td>
            </tr>
            <tr>
              <td><strong>बैंक दर (Bank Rate / SLF)</strong></td>
              <td style="color: #DC2626; font-weight: 800; font-size: 11px;">६.५०%</td>
              <td>करिडोरको माथिल्लो सीमा (Ceiling)</td>
              <td>स्थायी तरलता सुविधा (SLF) प्रदान गर्ने दर</td>
            </tr>
            <tr>
              <td><strong>निक्षेप संकलन दर (SDF Rate)</strong></td>
              <td style="color: #059669; font-weight: 800; font-size: 11px;">३.००%</td>
              <td>करिडोरको तल्लो सीमा (Floor)</td>
              <td>अधिक तरलता प्रशोचन (Standing Deposit Facility)</td>
            </tr>
            <tr>
              <td><strong>अनिवार्य नगद मौज्दात (CRR)</strong></td>
              <td style="font-weight: 800; font-size: 11px;">४.००%</td>
              <td>'क', 'ख' र 'ग' वर्गका बैंकहरू</td>
              <td>कुल निक्षेप दायित्वको केन्द्रीय बैंकमा राख्नुपर्ने मौज्दात</td>
            </tr>
            <tr>
              <td><strong>वैधानिक तरलता अनुपात (SLR)</strong></td>
              <td style="font-weight: 800; font-size: 11px;">१२.०% (क) / १०.०% (ख, ग)</td>
              <td>वाणिज्य बैंक १२%, विकास बैंक १०%</td>
              <td>नगद, सरकारी ऋणपत्र र योग्य तरलता सम्पत्तिको अनुपात</td>
            </tr>
            <tr>
              <td><strong>कर्जा-निक्षेप अनुपात (CD Ratio)</strong></td>
              <td style="font-weight: 800; font-size: 11px;">अधिकतम ९०.००%</td>
              <td>वाणिज्य बैंक तथा विकास बैंक</td>
              <td>अत्यधिक कर्जा विस्तार रोक्ने विवेकशील सीमा</td>
            </tr>
            <tr>
              <td><strong>पुँजी पर्याप्तता अनुपात (CAR)</strong></td>
              <td style="font-weight: 800; font-size: 11px;">न्यूनतम ११.००%</td>
              <td>वाणिज्य बैंक (Basel III अनुसार)</td>
              <td>जोखिम भारित सम्पत्ति (RWA) सँग पुँजी कोषको अनुपात</td>
            </tr>
            <tr>
              <td><strong>प्राथमिक पुँजी अनुपात (Tier 1)</strong></td>
              <td style="font-weight: 800; font-size: 11px;">न्यूनतम ८.५०% (बफर सहित)</td>
              <td>वाणिज्य बैंक</td>
              <td>साधारण सेयर तथा अविभाजित मुनाफा</td>
            </tr>
          </tbody>
        </table>

        <!-- Numerical Formulas Card Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
          <div class="info-card" style="border-left: 4px solid #0284C7;">
            <div style="font-size: 11px; font-weight: 800; color: #0284C7; margin-bottom: 4px;">
              📐 अनिवार्य नगद मौज्दात (CRR) गणना सूत्र
            </div>
            <div style="background: white; border: 1px solid #CBD5E1; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 10px; text-align: center; margin-bottom: 4px;">
              CRR = (NRB मा रहेको नगद मौज्दात ÷ कुल घरेलु निक्षेप) × १००
            </div>
            <div style="font-size: 9px; color: #475569;">
              <strong>परीक्षा टिप:</strong> पाक्षिक (Fortnightly) औसत आधारमा न्यूनतम ४% कायम हुनुपर्छ। कुनै एक दिन ७०% भन्दा कम हुनुहुँदैन।
            </div>
          </div>

          <div class="info-card" style="border-left: 4px solid #059669;">
            <div style="font-size: 11px; font-weight: 800; color: #059669; margin-bottom: 4px;">
              📐 कर्जा-निक्षेप अनुपात (CD Ratio) गणना सूत्र
            </div>
            <div style="background: white; border: 1px solid #CBD5E1; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 10px; text-align: center; margin-bottom: 4px;">
              CD Ratio = (कुल कर्जा ÷ [कुल निक्षेप + प्राथमिक पुँजी]) × १००
            </div>
            <div style="font-size: 9px; color: #475569;">
              <strong>परीक्षा टिप:</strong> ९०% भन्दा बढी भएमा बैंकलाई थप कर्जा प्रवाह गर्न राष्ट्र बैंकले रोक लगाउँछ र जरिवाना गर्छ।
            </div>
          </div>
        </div>

        <!-- Exam Trap Alert -->
        <div class="info-card" style="border-left: 4px solid #DC2626; margin-top: 8px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #991B1B; margin-bottom: 2px;">
            ⚠️ परीक्षार्थीले गर्ने सामान्य गल्ती (Exam Pitfall Warning):
          </div>
          <div style="font-size: 9.5px; color: #7F1D1D; line-height: 1.45;">
            पहिलेको CCD Ratio (अधिकतम ८०%) हाल खारेज भई CD Ratio (अधिकतम ९०%) लागू गरिएको छ। पुरानो गाइडबुक पढेर ८०% नलेख्नुहोस्।
          </div>
        </div>

        ${createPageFooter(6)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 7: BANK CLASSIFICATION & BAFIA CAPITAL FRAMEWORK          -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-7">
        ${createPageHeader('बैंक वर्गीकरण तथा पुँजीगत व्यवस्था', 'खण्ड ६', 7)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ८. बैंक तथा वित्तीय संस्था वर्गीकरण र पुँजीगत व्यवस्था (BAFIA २०७३)
          </h2>
          <span class="badge-gold">BAFIA 2073 FRAMEWORK</span>
        </div>

        <!-- BAFIA Classification Table -->
        <table class="table-custom">
          <thead>
            <tr>
              <th>वर्ग</th>
              <th>संस्थाको प्रकार</th>
              <th>न्यूनतम चुक्ता पुँजी</th>
              <th>कार्यक्षेत्र</th>
              <th>प्रमुख अनुमतिप्राप्त कार्यहरू (दफा ४९)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>'क' वर्ग</strong></td>
              <td>वाणिज्य बैंक (Commercial Banks)</td>
              <td style="color: #0284C7; font-weight: 800;">रु. ८ अर्ब</td>
              <td>देशभर (राष्ट्रिय)</td>
              <td>निक्षेप, कर्जा, LC, Bank Guarantee, विदेशी विनिमय, कन्सोर्टियम कर्जा</td>
            </tr>
            <tr>
              <td><strong>'ख' वर्ग</strong></td>
              <td>विकास बैंक (Development Banks)</td>
              <td style="color: #0284C7; font-weight: 800;">रु. २.५ अर्ब (राष्ट्रिय) / रु. १.२ अर्ब (प्रादेशिक)</td>
              <td>राष्ट्रिय वा प्रादेशिक</td>
              <td>निक्षेप, मध्यकालीन तथा दीर्घकालीन औद्योगिक/कृषि कर्जा, सीमित विदेशी विनिमय</td>
            </tr>
            <tr>
              <td><strong>'ग' वर्ग</strong></td>
              <td>वित्त कम्पनी (Finance Companies)</td>
              <td style="color: #0284C7; font-weight: 800;">रु. ८० करोड (राष्ट्रिय) / रु. ५० करोड (प्रादेशिक)</td>
              <td>राष्ट्रिय वा प्रादेशिक</td>
              <td>हायर पर्चेज, हाउजिङ, लिजिङ कर्जा, मुद्दती तथा बचत निक्षेप स्वीकार</td>
            </tr>
            <tr>
              <td><strong>'घ' वर्ग</strong></td>
              <td>लघुवित्त वित्तीय संस्था (Microfinance)</td>
              <td style="color: #0284C7; font-weight: 800;">रु. १० करोड</td>
              <td>राष्ट्रिय वा प्रादेशिक</td>
              <td>विपन्न वर्गलाई विना धितो समूह जमानीमा लघु कर्जा, लघु निक्षेप परिचालन</td>
            </tr>
            <tr>
              <td><strong>विशिष्ट</strong></td>
              <td>पूर्वाधार विकास बैंक (NIFRA)</td>
              <td style="color: #0284C7; font-weight: 800;">रु. २० अर्ब</td>
              <td>पूर्वाधार परियोजना</td>
              <td>ठूला पूर्वाधार, जलविद्युत, सडक, सुरुङमार्ग आदिमा दीर्घकालीन लगानी</td>
            </tr>
          </tbody>
        </table>

        <!-- Board of Directors Governance Structure Card -->
        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; margin-top: 12px;">
          <div style="font-size: 11.5px; font-weight: 800; color: #0B2046; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 8px;">
            🏛️ सञ्चालक समिति (Board of Directors) सम्बन्धी कानुनी मापदण्ड (BAFIA दफा १४)
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9.5px; color: #334155;">
            <div>
              <strong>संख्या र संरचना:</strong>
              <ul style="margin: 4px 0 0 14px; padding: 0;">
                <li>सञ्चालक समितिमा न्यूनतम ५ र अधिकतम ७ जना सञ्चालक रहनेछन्।</li>
                <li>कम्तीमा १ जना स्वतन्त्र सञ्चालक (Independent Director) अनिवार्य।</li>
                <li>संस्थापक र सर्वसाधारण सेयर अनुपात अनुसार सञ्चालकको प्रतिनिधित्व।</li>
              </ul>
            </div>
            <div>
              <strong>कार्यकाल र योग्यता:</strong>
              <ul style="margin: 4px 0 0 14px; padding: 0;">
                <li>सञ्चालकको कार्यकाल बढीमा ४ वर्षको हुनेछ (पुनः नियुक्ति हुन सक्ने)।</li>
                <li>स्वतन्त्र सञ्चालक एक कार्यकालका लागि मात्र नियुक्त हुन पाउनेछ।</li>
                <li>कार्यकारी प्रमुख (CEO) को कार्यकाल ४ वर्षको हुने (बढीमा २ कार्यकाल)।</li>
              </ul>
            </div>
          </div>
        </div>

        ${createPageFooter(7)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 8: LOAN CLASSIFICATION & PROVISIONING (NPL & LLP)         -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-8">
        ${createPageHeader('कर्जा वर्गीकरण र नोक्सानी व्यवस्था', 'खण्ड ७', 8)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ९. कर्जा वर्गीकरण र नोक्सानी व्यवस्था (NRB Directive No. 2 Standard Table)
          </h2>
          <span class="badge-red">DIRECTIVE NO. 2 (NPL)</span>
        </div>

        <table class="table-custom">
          <thead>
            <tr>
              <th>कर्जाको वर्ग (Category)</th>
              <th>भाखा नाघेको अवधि (Overdue Period)</th>
              <th>नोक्सानी व्यवस्था (LLP Rate)</th>
              <th>कर्जाको प्रकृतिको व्याख्या</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #F0FDF4;">
              <td><strong>१. असल कर्जा (Pass Loan)</strong></td>
              <td>भाखा ननाघेको वा १ महिनासम्म भाखा नाघेको</td>
              <td style="color: #059669; font-weight: 800; font-size: 11px;">१.२०%</td>
              <td>नियमित रूपमा साँवा-ब्याज भुक्तानी भइरहेको सक्रिय कर्जा</td>
            </tr>
            <tr style="background: #FEFCE8;">
              <td><strong>२. सूक्ष्म निगरानी (Watchlist)</strong></td>
              <td>१ महिना देखि ३ महिनासम्म भाखा नाघेको</td>
              <td style="color: #D97706; font-weight: 800; font-size: 11px;">५.००%</td>
              <td>म्याद नाघेको, वा लगातार २ वर्ष नोक्सानीमा रहेको व्यवसाय</td>
            </tr>
            <tr style="background: #FFF7ED;">
              <td><strong>३. कमसल कर्जा (Substandard)</strong></td>
              <td>३ महिना देखि ६ महिनासम्म भाखा नाघेको</td>
              <td style="color: #EA580C; font-weight: 800; font-size: 11px;">२५.००%</td>
              <td>निष्क्रिय कर्जा (NPL) सुरु, धितोको बजार मूल्य घट्न थालेको</td>
            </tr>
            <tr style="background: #FEF2F2;">
              <td><strong>४. शंकास्पद कर्जा (Doubtful)</strong></td>
              <td>६ महिना देखि १ वर्षसम्म भाखा नाघेको</td>
              <td style="color: #DC2626; font-weight: 800; font-size: 11px;">५०.००%</td>
              <td>साँवा-ब्याज असुलीमा गम्भीर शंका, धितोले कर्जा नधान्ने अवस्था</td>
            </tr>
            <tr style="background: #FEE2E2;">
              <td><strong>५. खराब कर्जा (Bad / Loss)</strong></td>
              <td>१ वर्षभन्दा बढी भाखा नाघेको वा कालोसूचीमा परेको</td>
              <td style="color: #991B1B; font-weight: 800; font-size: 11px;">१००.००%</td>
              <td>ऋणी बेपत्ता भएको, धितो लिलाम हुन नसकेको वा फर्जी कागजात</td>
            </tr>
          </tbody>
        </table>

        <!-- Performing vs Non-Performing Summary -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;">
          <div class="info-card" style="border-left: 4px solid #059669;">
            <div style="font-size: 11px; font-weight: 800; color: #065F46; margin-bottom: 2px;">
              🟢 सक्रिय कर्जा (Performing Loans)
            </div>
            <div style="font-size: 9.5px; color: #334155; line-height: 1.5;">
              असल कर्जा र सूक्ष्म निगरानी कर्जालाई सक्रिय कर्जा भनिन्छ। यस अन्तर्गत गरिएको नोक्सानी व्यवस्थालाई सामान्य कर्जा नोक्सानी व्यवस्था (General Loan Loss Provision) भनिन्छ र यो पुँजी कोषको पूरक पुँजी (Tier 2 Capital) मा गणना गर्न पाइन्छ।
            </div>
          </div>

          <div class="info-card" style="border-left: 4px solid #DC2626;">
            <div style="font-size: 11px; font-weight: 800; color: #991B1B; margin-bottom: 2px;">
              🔴 निष्क्रिय कर्जा (Non-Performing Loans - NPL)
            </div>
            <div style="font-size: 9.5px; color: #334155; line-height: 1.5;">
              कमसल, शंकास्पद र खराब कर्जालाई निष्क्रिय कर्जा भनिन्छ। यस अन्तर्गत गरिएको नोक्सानी व्यवस्थालाई विशेष कर्जा नोक्सानी व्यवस्था (Specific Loan Loss Provision) भनिन्छ। बैंकको कुल कर्जामा NPL ५% भन्दा बढी हुन नहुने अन्तर्राष्ट्रिय मापदण्ड छ।
            </div>
          </div>
        </div>

        ${createPageFooter(8)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 9: STATUTORY BANKING ACTS & LAWS HUB                      -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-9">
        ${createPageHeader('प्रमुख बैंकिङ्ग ऐन तथा कानुनी व्यवस्थाहरू', 'खण्ड ८', 9)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            १०. प्रमुख बैंकिङ्ग ऐन तथा कानुनी व्यवस्थाहरू (Statutory Laws Hub)
          </h2>
          <span class="badge-accent">ACTS & REGULATIONS</span>
        </div>

        <!-- 4 Core Acts Summary Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div class="info-card" style="border-left: 4px solid #1E40AF;">
            <div style="font-size: 11px; font-weight: 800; color: #1E3A8A; margin-bottom: 2px;">
              १. नेपाल राष्ट्र बैंक ऐन, २०५८ (NRB Act 2058)
            </div>
            <div style="font-size: 9px; color: #334155; line-height: 1.45;">
              <strong>दफा ४ का उद्देश्यहरू:</strong> मूल्य स्थिरता, शोधनान्तर स्थिरता, वित्तीय स्थायित्व र सुरक्षित भुक्तानी प्रणाली।<br/>
              <strong>दफा १४:</strong> गभर्नर, २ डेपुटी गभर्नर, सचिव (अर्थ मन्त्रालय) र ३ विज्ञ गरी ७ सदस्यीय सञ्चालक समिति।<br/>
              <strong>दफा ७५:</strong> सरकारलाई असीमित ऋण दिन निषेध (अघिल्लो वर्षको राजस्वको अधिकतम १०% सम्म १८० दिनका लागि)।
            </div>
          </div>

          <div class="info-card" style="border-left: 4px solid #0284C7;">
            <div style="font-size: 11px; font-weight: 800; color: #0369A1; margin-bottom: 2px;">
              २. बैंक तथा वित्तीय संस्था सम्बन्धी ऐन, २०७३ (BAFIA 2073)
            </div>
            <div style="font-size: 9px; color: #334155; line-height: 1.45;">
              <strong>दफा ३-९:</strong> बैंक स्थापना र इजाजतपत्र प्रक्रिया।<br/>
              <strong>दफा ४९:</strong> बैंकहरूको वर्गीकरण अनुसार गर्न पाउने कार्यहरू।<br/>
              <strong>दफा ५०:</strong> बैंकहरूले गर्न नपाउने निषेधित कार्यहरू (घरजग्गा व्यापार, आफ्नै सेयर धितोमा ऋण, सञ्चालकलाई ऋण निषेध)।
            </div>
          </div>

          <div class="info-card" style="border-left: 4px solid #D97706;">
            <div style="font-size: 11px; font-weight: 800; color: #92400E; margin-bottom: 2px;">
              ३. सम्पत्ति शुद्धीकरण निवारण ऐन, २०६४ (AML/CFT Act)
            </div>
            <div style="font-size: 9px; color: #334155; line-height: 1.45;">
              <strong>३ प्रमुख चरणहरू:</strong> Placement (प्रवेश) ➔ Layering (तहकीकीकरण) ➔ Integration (एकीकरण)।<br/>
              <strong>TTR (सीमा कारोबार):</strong> रु. १० लाख वा सोभन्दा बढीको नगद कारोबार १५ दिनभित्र प्रतिवेदन।<br/>
              <strong>STR (शंकास्पद कारोबार):</strong> शंका लागेको ३ दिनभित्र वित्तीय जानकारी एकाइ (FIU) लाई प्रतिवेदन।
            </div>
          </div>

          <div class="info-card" style="border-left: 4px solid #DC2626;">
            <div style="font-size: 11px; font-weight: 800; color: #991B1B; margin-bottom: 2px;">
              ४. बैंकिङ कसूर तथा सजाय ऐन, २०६४
            </div>
            <div style="font-size: 9px; color: #334155; line-height: 1.45;">
              <strong>कसूरहरू:</strong> खातामा पर्याप्त मौज्दात नभई चेक काट्नु (Check Bounce), अनाधिकृत ओभरड्राफ्ट, किर्ते कागजात पेश गरी कर्जा लिनु, एटीएम ह्याकिङ।<br/>
              <strong>सजाय:</strong> बिगो बमोजिम जरिवाना र बिगोको परिमाण अनुसार कैद सजाय (५ वर्षसम्म)।
            </div>
          </div>
        </div>

        ${createPageFooter(9)}
      </div>

      <!-- ============================================================== -->
      <!-- PAGE 10: EXAM STRATEGY & 10-MARK MODEL ANSWER ARCHITECTURE     -->
      <!-- ============================================================== -->
      <div class="a4-page" id="pdf-page-10">
        ${createPageHeader('परीक्षा रणनीति तथा १०-अङ्कको मोडेल उत्तर', 'खण्ड ९', 10)}

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; color: #0B2046;">
            ११. लोक सेवा तथा बैंकिङ परीक्षा रणनीति र नमुना उत्तर लेखन ढाँचा
          </h2>
          <span class="badge-gold">EXAM WINNING STRATEGY</span>
        </div>

        <!-- 10 Mark Architecture Grid -->
        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 800; color: #0B2046; margin-bottom: 6px;">
            ✍️ १०-अङ्कको आदर्श उत्तरको संरचना (Standard 10-Mark Model Answer Framework)
          </div>

          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 8px; font-size: 9.5px;">
            <div style="background: white; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px;">
              <strong style="color: #0284C7;">१. पृष्ठभूमि / परिचय (१५%)</strong>
              <div style="color: #64748B; margin-top: 3px;">
                विषयवस्तुको कानुनी वा प्राज्ञिक परिभाषा (२ देखि ३ वाक्य मात्र)। अनावश्यक लामो गन्थन नगर्ने।
              </div>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px;">
              <strong style="color: #059669;">२. मुख्य विश्लेषणात्मक खण्ड (७०%)</strong>
              <div style="color: #64748B; margin-top: 3px;">
                प्रश्नका उप-खण्डहरू अनुसार स्पष्ट Sub-headings, बुँदागत प्रस्तुति, चार्ट वा फ्लोचार्ट, तथ्याङ्क तथा ऐनका दफाहरूको उद्धरण।
              </div>
            </div>
            <div style="background: white; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px;">
              <strong style="color: #D97706;">३. निष्कर्ष (१५%)</strong>
              <div style="color: #64748B; margin-top: 3px;">
                समस्या समाधानमुखी, सकारात्मक र नीतिगत सुझाव सहितको २ वाक्यको निष्कर्ष।
              </div>
            </div>
          </div>
        </div>

        <!-- Time Allocation Table -->
        <table class="table-custom">
          <thead>
            <tr>
              <th>प्रश्नको भार</th>
              <th>समय विनियोजन (Time Budget)</th>
              <th>शब्द सीमा (Word Count)</th>
              <th>अपेक्षित ढाँचा (Structure)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>२ अङ्क (MCQ)</strong></td>
              <td>४५ देखि ५० सेकेन्ड</td>
              <td>सही विकल्प मात्र छनोट</td>
              <td>प्रश्न ध्यानपूर्वक पढी Bubble भर्ने</td>
            </tr>
            <tr>
              <td><strong>५ अङ्क (छोटो उत्तर)</strong></td>
              <td>९ मिनेट</td>
              <td>१०० देखि १२० शब्द</td>
              <td>परिचय १ वाक्य, मुख्य ५ बुँदा, टुङ्ग्याउनी</td>
            </tr>
            <tr>
              <td><strong>१० अङ्क (लामो उत्तर)</strong></td>
              <td>१८ मिनेट</td>
              <td>२०० देखि २५० शब्द</td>
              <td>परिचय, मुख्य विश्लेषणात्मक बुँदाहरू, फ्लोचार्ट, निष्कर्ष</td>
            </tr>
          </tbody>
        </table>

        <!-- Sign-off & Verification Seal -->
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 14px 18px; margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #1E40AF;">
              बैंकिङ्ग तयारी नेपाल - प्राज्ञिक अनुसन्धान तथा परीक्षा प्रणाली बोर्ड
            </div>
            <div style="font-size: 9px; color: #334155; margin-top: 2px;">
              Chief Academic Architect & Learning-System Engineering Team • Kathmandu, Nepal
            </div>
          </div>
          <div style="text-align: right;">
            <div style="display: inline-block; border: 2px solid #1E40AF; padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 900; color: #1E40AF; letter-spacing: 0.5px;">
              OFFICIAL VERIFIED
            </div>
          </div>
        </div>

        ${createPageFooter(10)}
      </div>

    </div>
  `;
}

/**
 * Downloads the complete multi-page syllabus PDF directly to user's device
 * Saved as: Banking_Tayari_Nepal_Complete_Syllabus.pdf
 */
export async function downloadCompleteSyllabusPdf(
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<void> {
  const notify = (percent: number, stage: string, status: 'generating' | 'success' | 'error' = 'generating', errorMessage?: string) => {
    if (onProgress) {
      onProgress({ percent, stage, status, errorMessage });
    }
  };

  notify(5, 'पाठ्यक्रम डेटा र A4 ढाँचा तयार गर्दै...');

  // Create offscreen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#FFFFFF';
  container.style.zIndex = '-9999';
  container.innerHTML = buildCompleteSyllabusA4Html();

  document.body.appendChild(container);

  try {
    // Settle fonts and rendering
    notify(15, 'नेपाली युनिकोड र टाइफोग्राफी सक्रिय गर्दै...');
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Get all 10 page elements
    const pageElements = container.querySelectorAll<HTMLElement>('.a4-page');
    const totalPages = pageElements.length;

    if (totalPages === 0) {
      throw new Error('No page containers found in generated template.');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    for (let i = 0; i < totalPages; i++) {
      const pageEl = pageElements[i];
      const pageNum = i + 1;
      const progressPercent = Math.round(20 + ((i + 1) / totalPages) * 70);

      notify(
        progressPercent,
        `पृष्ठ ${pageNum} / ${totalPages} उच्च-रिजोल्युसनमा रेन्डर गर्दै...`
      );

      const canvas = await html2canvas(pageEl, {
        scale: 2, // High resolution crisp rendering
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: 794,
        height: 1123,
        windowWidth: 794
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    notify(95, 'PDF फाइल कम्पाइल र डाउनलोड तयार गर्दै...');
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Direct save with exact required file name
    pdf.save('Banking_Tayari_Nepal_Complete_Syllabus.pdf');

    notify(100, 'PDF downloaded successfully.', 'success');
  } catch (err: any) {
    console.error('Error generating complete syllabus PDF:', err);
    notify(0, 'PDF निर्माणमा त्रुटि भयो। प्रिन्ट विकल्प प्रयोग गर्नुहोस्।', 'error', err?.message || 'Generation failed');
    throw err;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Fallback: Prints or opens native browser Save-as-PDF dialog for complete syllabus
 */
export function printCompleteSyllabusFallback(): void {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="ne">
      <head>
        <meta charset="utf-8">
        <title>Banking_Tayari_Nepal_Complete_Syllabus</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: #FFFFFF;
          }
          .a4-page {
            page-break-after: always;
            break-after: page;
            height: auto !important;
            min-height: 270mm !important;
            box-shadow: none !important;
          }
        </style>
      </head>
      <body>
        ${buildCompleteSyllabusA4Html()}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 600);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
