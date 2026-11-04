import { jsPDF } from 'jspdf';

export interface CertificateData {
  candidateName: string;
  targetDomain: string;
  compositeScore: number;
  percentile?: number | null;
  applicationId: string;
  issueDate?: string | Date;
  roundScores?: {
    resume?: number | null;
    oa?: number | null;
    dsa?: number | null;
    hr?: number | null;
  };
}

export const generatePlacementCertificate = (data: CertificateData): void => {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // 1. Outer Dark Background
  doc.setFillColor(11, 15, 25); // Deep Dark Slate #0B0F19
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Decorative Outer Border (Crimson Accent)
  doc.setDrawColor(225, 29, 72); // Crimson #E11D48
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // 3. Inner Decorative Border (Gold/Metallic Accent)
  doc.setDrawColor(217, 119, 6); // Amber/Gold #D97706
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26);

  // Corner Accent Brackets
  const cornerSize = 8;
  doc.setDrawColor(225, 29, 72);
  doc.setLineWidth(2);
  // Top-left
  doc.line(10, 10 + cornerSize, 10, 10);
  doc.line(10, 10, 10 + cornerSize, 10);
  // Top-right
  doc.line(pageWidth - 10 - cornerSize, 10, pageWidth - 10, 10);
  doc.line(pageWidth - 10, 10, pageWidth - 10, 10 + cornerSize);
  // Bottom-left
  doc.line(10, pageHeight - 10 - cornerSize, 10, pageHeight - 10);
  doc.line(10, pageHeight - 10, 10 + cornerSize, pageHeight - 10);
  // Bottom-right
  doc.line(pageWidth - 10 - cornerSize, pageHeight - 10, pageWidth - 10, pageHeight - 10);
  doc.line(pageWidth - 10, pageHeight - 10 - cornerSize, pageWidth - 10, pageHeight - 10);

  // 4. Header Badge / Issuer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(225, 29, 72); // Crimson
  doc.text('HIREREADY AI • ACCELERATED RECRUITMENT PLATFORM', pageWidth / 2, 28, { align: 'center' });

  // 5. Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('CERTIFICATE OF TECHNICAL MERIT', pageWidth / 2, 42, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text('THIS IS TO OFFICIALLY CERTIFY THAT', pageWidth / 2, 53, { align: 'center' });

  // 6. Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  const candidateName = data.candidateName.toUpperCase();
  doc.text(candidateName, pageWidth / 2, 69, { align: 'center' });

  // Underline beneath candidate name
  const nameWidth = doc.getTextWidth(candidateName);
  doc.setDrawColor(225, 29, 72);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - nameWidth / 2 - 10, 72, pageWidth / 2 + nameWidth / 2 + 10, 72);

  // 7. Achievement Statement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225); // Slate-300
  const statement = `has successfully demonstrated outstanding competency across all 4 mandatory evaluation rounds, clearing industry-standard algorithmic coding bars, technical screening, and behavioral leadership rubrics.`;
  doc.text(statement, pageWidth / 2, 82, { align: 'center', maxWidth: 220 });

  // 8. Metric Cards (Domain, Composite Score, Standing)
  const cardY = 100;
  const cardHeight = 32;

  // Domain Card
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, cardY, 70, cardHeight, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('ASSESSED DOMAIN', 65, cardY + 9, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(data.targetDomain, 65, cardY + 20, { align: 'center', maxWidth: 64 });

  // Composite Score Card (Crimson Highlight)
  doc.setFillColor(22, 17, 30);
  doc.setDrawColor(225, 29, 72);
  doc.setLineWidth(0.8);
  doc.roundedRect(110, cardY, 77, cardHeight, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(251, 113, 133);
  doc.text('COMPOSITE SCORE (100 BAR)', 148.5, cardY + 9, { align: 'center' });
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.compositeScore} / 100`, 148.5, cardY + 22, { align: 'center' });

  // Standing / Percentile Card
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.5);
  doc.roundedRect(197, cardY, 70, cardHeight, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('COHORT STANDING', 232, cardY + 9, { align: 'center' });
  doc.setFontSize(13);
  doc.setTextColor(52, 211, 153); // Emerald
  const standingText = data.percentile ? `Top ${Math.max(1, 100 - data.percentile)}% Tier` : 'Offer Extended';
  doc.text(standingText, 232, cardY + 21, { align: 'center' });

  // 9. Multi-Round Breakdown Details
  if (data.roundScores) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    const scoreSummary = `Weighted Contribution: Resume (15%): ${data.roundScores.resume ?? '-'}  •  OA (25%): ${
      data.roundScores.oa ?? '-'
    }  •  DSA Technical (40%): ${data.roundScores.dsa ?? '-'}  •  HR Behavioral (20%): ${data.roundScores.hr ?? '-'}`;
    doc.text(scoreSummary, pageWidth / 2, 142, { align: 'center' });
  }

  // 10. Verification Metadata & Signatures
  const footerY = 162;

  // Left side: Verification Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  const certId = `HR-CERT-${data.applicationId.replace(/-/g, '').substring(0, 10).toUpperCase()}`;
  doc.text(`Certificate Identifier: ${certId}`, 30, footerY);
  const formattedDate = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  doc.text(`Conferment Date: ${formattedDate}`, 30, footerY + 6);
  doc.text(`Dual-DB Verification: Neon PostgreSQL & MongoDB Atlas`, 30, footerY + 12);

  // Right side: Official Seal / Signature
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(225, 29, 72);
  doc.text('HireReady Evaluation Committee', pageWidth - 30, footerY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Automated Multi-Round AI Proctoring System', pageWidth - 30, footerY + 5, { align: 'right' });
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 90, footerY + 12, pageWidth - 30, footerY + 12);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Digital Verification', pageWidth - 30, footerY + 16, { align: 'right' });

  // 11. Mandatory Disclaimer (Required)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const disclaimer = `Notice: This credential is issued for a Simulated Placement Assessment & Technical Competency Demonstration on HireReady AI.`;
  doc.text(disclaimer, pageWidth / 2, 194, { align: 'center' });

  // 12. Save PDF
  const filename = `HireReady_Certificate_${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};
