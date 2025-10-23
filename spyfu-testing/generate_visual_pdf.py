#!/usr/bin/env python3
"""
Generate a highly visual PDF report from SpyFu API data
"""

import json
import os
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, 
    PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.lib.colors import HexColor, PCMYKColor

# Load the JSON data
with open('comprehensive_data_points.json', 'r') as f:
    data = json.load(f)

# Define color scheme
PRIMARY_COLOR = HexColor('#2563eb')  # Blue
SECONDARY_COLOR = HexColor('#10b981')  # Green
ACCENT_COLOR = HexColor('#f59e0b')  # Amber
DANGER_COLOR = HexColor('#ef4444')  # Red
GRAY_COLOR = HexColor('#6b7280')  # Gray

# Custom page template with header and footer
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        page_num = self._pageNumber
        
        # Header
        self.saveState()
        self.setFillColor(PRIMARY_COLOR)
        self.rect(0, letter[1] - 0.75*inch, letter[0], 0.75*inch, fill=1, stroke=0)
        
        self.setFillColor(colors.white)
        self.setFont('Helvetica-Bold', 20)
        self.drawString(0.75*inch, letter[1] - 0.5*inch, "SpyFu API Complete Data Report")
        
        # Footer
        self.setFillColor(GRAY_COLOR)
        self.setFont('Helvetica', 9)
        self.drawRightString(letter[0] - 0.75*inch, 0.5*inch, 
                            f"Page {page_num} of {page_count}")
        self.drawString(0.75*inch, 0.5*inch, 
                       f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        
        self.restoreState()

# Create the PDF
pdf_filename = "SpyFu_API_Visual_Report.pdf"
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=0.75*inch,
    leftMargin=0.75*inch,
    topMargin=1*inch,
    bottomMargin=0.75*inch
)

# Container for the 'Flowable' objects
elements = []

# Define styles
styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=24,
    textColor=PRIMARY_COLOR,
    spaceAfter=30,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading1_style = ParagraphStyle(
    'CustomHeading1',
    parent=styles['Heading1'],
    fontSize=18,
    textColor=PRIMARY_COLOR,
    spaceAfter=12,
    spaceBefore=12,
    fontName='Helvetica-Bold'
)

heading2_style = ParagraphStyle(
    'CustomHeading2',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=SECONDARY_COLOR,
    spaceAfter=10,
    spaceBefore=10,
    fontName='Helvetica-Bold'
)

heading3_style = ParagraphStyle(
    'CustomHeading3',
    parent=styles['Heading3'],
    fontSize=12,
    textColor=ACCENT_COLOR,
    spaceAfter=8,
    spaceBefore=8,
    fontName='Helvetica-Bold'
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=10,
    textColor=colors.black,
    spaceAfter=6,
    alignment=TA_JUSTIFY
)

code_style = ParagraphStyle(
    'CustomCode',
    parent=styles['Code'],
    fontSize=8,
    textColor=colors.black,
    backColor=HexColor('#f3f4f6'),
    leftIndent=10,
    rightIndent=10,
    spaceAfter=10
)

# Title Page
elements.append(Spacer(1, 2*inch))
elements.append(Paragraph("SpyFu API", title_style))
elements.append(Paragraph("Complete Data Point Reference", title_style))
elements.append(Spacer(1, 0.5*inch))

# Summary box
summary_data = [
    ["Test Domains", "3 Size Categories"],
    ["Small Site", "viridisenergy.com (~15,132 KWs)"],
    ["Medium Site", "poolsbybradley.com (~1,451 KWs)"],
    ["Enterprise Site", "skyscanner.com (~1.8M KWs)"],
    ["", ""],
    ["API Endpoints Tested", "9 Working Endpoints"],
    ["Total Data Points", "207 Individual Metrics"],
    ["Real Data Samples", "✓ All Included"],
]

summary_table = Table(summary_data, colWidths=[2.5*inch, 3.5*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, 4), HexColor('#eff6ff')),
    ('BACKGROUND', (0, 5), (-1, -1), HexColor('#f0fdf4')),
    ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 1), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
]))

elements.append(summary_table)
elements.append(PageBreak())

# Executive Summary
elements.append(Paragraph("📊 Executive Summary", heading1_style))
elements.append(Spacer(1, 0.2*inch))

exec_summary_text = """
This comprehensive report documents all available data points from the SpyFu SEO API across 
9 working endpoints. Each endpoint has been tested against three real-world domains of varying 
sizes to demonstrate actual data output and API costs.
"""
elements.append(Paragraph(exec_summary_text, body_style))
elements.append(Spacer(1, 0.2*inch))

# Key findings chart
elements.append(Paragraph("Domain Comparison Overview", heading2_style))

# Extract key metrics for comparison
domains_data = {
    'small': data.get('small', {}).get('getLiveSeoStats', {}),
    'medium': data.get('medium', {}).get('getLiveSeoStats', {}),
    'enterprise': data.get('enterprise', {}).get('getLiveSeoStats', {})
}

# Create comparison table
comparison_data = [
    ["Metric", "Small", "Medium", "Enterprise"],
    ["Total Keywords", 
     f"{domains_data['small'].get('totalOrganicResults', 0):,}",
     f"{domains_data['medium'].get('totalOrganicResults', 0):,}",
     f"{domains_data['enterprise'].get('totalOrganicResults', 0):,}"],
    ["Monthly Clicks", 
     f"{domains_data['small'].get('monthlyOrganicClicks', 0):,}",
     f"{domains_data['medium'].get('monthlyOrganicClicks', 0):,}",
     f"{domains_data['enterprise'].get('monthlyOrganicClicks', 0):,}"],
    ["Click Value/Month", 
     f"${domains_data['small'].get('monthlyOrganicClickValue', 0):,.2f}",
     f"${domains_data['medium'].get('monthlyOrganicClickValue', 0):,.2f}",
     f"${domains_data['enterprise'].get('monthlyOrganicClickValue', 0):,.2f}"],
    ["Total Search Volume", 
     f"{domains_data['small'].get('totalSearchVolume', 0):,}",
     f"{domains_data['medium'].get('totalSearchVolume', 0):,}",
     f"{domains_data['enterprise'].get('totalSearchVolume', 0):,}"],
]

comparison_table = Table(comparison_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 1.5*inch])
comparison_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (0, -1), 'LEFT'),
    ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#f9fafb')]),
    ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 1), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
]))

elements.append(comparison_table)
elements.append(Spacer(1, 0.3*inch))

# API Endpoints Overview
elements.append(PageBreak())
elements.append(Paragraph("🔍 API Endpoints Overview", heading1_style))
elements.append(Spacer(1, 0.2*inch))

endpoints_info = [
    ["Endpoint", "Purpose", "Data Points", "Cost/5 Rows"],
    ["getLiveSeoStats", "Domain overview statistics", "7", "$0.0005"],
    ["getMostValuableKeywords", "Highest value keywords", "25", "$0.0025"],
    ["getLostRanksKeywords", "Keywords that IMPROVED", "25", "$0.0025"],
    ["getGainedRanksKeywords", "Keywords that DROPPED", "25", "$0.0025"],
    ["getNewlyRankedKeywords", "New rankings (last 30d)", "25", "$0.0025"],
    ["getJustFellOffKeywords", "Fell off page 1", "25", "$0.0025"],
    ["getGainedClicksKeywords", "Keywords gaining clicks", "25", "$0.0025"],
    ["getLostClicksKeywords", "Keywords losing clicks", "25", "$0.0025"],
    ["getSeoKeywords", "All ranking keywords", "25", "$0.0025"],
]

endpoints_table = Table(endpoints_info, colWidths=[2*inch, 2.5*inch, 1*inch, 1*inch])
endpoints_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), SECONDARY_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#f9fafb')]),
    ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 1), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
]))

elements.append(endpoints_table)
elements.append(Spacer(1, 0.2*inch))

cost_note = """
<b>💰 Cost Model:</b> SpyFu API charges (rows returned ÷ 1000) × $0.50. 
All costs shown are based on pageSize=5 limit and are IDENTICAL across all domain sizes.
"""
elements.append(Paragraph(cost_note, body_style))

elements.append(PageBreak())

# Detailed Data Points for Each Endpoint
def create_endpoint_section(endpoint_name, endpoint_data, description):
    """Create a detailed section for each endpoint"""
    section_elements = []
    
    # Section header
    section_elements.append(Paragraph(f"📌 {endpoint_name}", heading1_style))
    section_elements.append(Paragraph(description, body_style))
    section_elements.append(Spacer(1, 0.1*inch))
    
    # Get sample data from each domain size
    small_data = data.get('small', {}).get(endpoint_name, {})
    medium_data = data.get('medium', {}).get(endpoint_name, {})
    enterprise_data = data.get('enterprise', {}).get(endpoint_name, {})
    
    # If it's a list (keyword data), take first item
    if isinstance(small_data, list) and len(small_data) > 0:
        small_sample = small_data[0]
        medium_sample = medium_data[0] if medium_data else {}
        enterprise_sample = enterprise_data[0] if enterprise_data else {}
        
        # Extract all keys from the first sample
        if small_sample:
            keys = list(small_sample.keys())
            
            # Create data point comparison (max 10 per page to avoid overflow)
            for i in range(0, len(keys), 10):
                batch_keys = keys[i:i+10]
                
                comparison_data = [["Data Point", "Small", "Medium", "Enterprise"]]
                
                for key in batch_keys:
                    small_val = small_sample.get(key, 'null')
                    medium_val = medium_sample.get(key, 'null')
                    enterprise_val = enterprise_sample.get(key, 'null')
                    
                    # Format values
                    def format_val(v):
                        if v is None or v == 'null':
                            return 'null'
                        elif isinstance(v, (int, float)):
                            if isinstance(v, float) and v < 1 and v > 0:
                                return f"{v:.2f}"
                            elif isinstance(v, float):
                                return f"{v:,.2f}"
                            else:
                                return f"{v:,}"
                        elif isinstance(v, str) and len(v) > 40:
                            return v[:37] + "..."
                        return str(v)
                    
                    comparison_data.append([
                        key,
                        format_val(small_val),
                        format_val(medium_val),
                        format_val(enterprise_val)
                    ])
                
                data_table = Table(comparison_data, colWidths=[1.8*inch, 1.6*inch, 1.6*inch, 1.5*inch])
                data_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), ACCENT_COLOR),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#fffbeb')]),
                    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#e5e7eb')),
                    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 1), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
                ]))
                
                section_elements.append(data_table)
                section_elements.append(Spacer(1, 0.15*inch))
    
    elif isinstance(small_data, dict):
        # For getLiveSeoStats (single object response)
        keys = list(small_data.keys())
        
        comparison_data = [["Data Point", "Small", "Medium", "Enterprise"]]
        
        for key in keys:
            small_val = small_data.get(key, 'null')
            medium_val = medium_data.get(key, 'null')
            enterprise_val = enterprise_data.get(key, 'null')
            
            # Format values
            def format_val(v):
                if v is None or v == 'null':
                    return 'null'
                elif isinstance(v, (int, float)):
                    if isinstance(v, float) and v < 1 and v > 0:
                        return f"{v:.2f}"
                    elif isinstance(v, float):
                        return f"{v:,.2f}"
                    else:
                        return f"{v:,}"
                return str(v)
            
            comparison_data.append([
                key,
                format_val(small_val),
                format_val(medium_val),
                format_val(enterprise_val)
            ])
        
        data_table = Table(comparison_data, colWidths=[1.8*inch, 1.6*inch, 1.6*inch, 1.5*inch])
        data_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), ACCENT_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, HexColor('#fffbeb')]),
            ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#e5e7eb')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 1), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ]))
        
        section_elements.append(data_table)
        section_elements.append(Spacer(1, 0.15*inch))
    
    section_elements.append(PageBreak())
    return section_elements

# Add all endpoint sections
endpoints = [
    ("getLiveSeoStats", "Domain overview with total keywords, clicks, and value metrics"),
    ("getMostValuableKeywords", "Keywords with the highest estimated commercial value"),
    ("getLostRanksKeywords", "Keywords that IMPROVED in ranking (negative rankChange = better position)"),
    ("getGainedRanksKeywords", "Keywords that DROPPED in ranking (positive rankChange = worse position)"),
    ("getNewlyRankedKeywords", "New keywords that started ranking in the last 30 days"),
    ("getJustFellOffKeywords", "Keywords that recently dropped off page 1 of search results"),
    ("getGainedClicksKeywords", "Keywords experiencing increases in organic click volume"),
    ("getLostClicksKeywords", "Keywords experiencing decreases in organic click volume"),
    ("getSeoKeywords", "Complete list of all ranking keywords for the domain"),
]

for endpoint_name, description in endpoints:
    elements.extend(create_endpoint_section(endpoint_name, None, description))

# Final page - Contact/Notes
elements.append(Paragraph("📝 Implementation Notes", heading1_style))
elements.append(Spacer(1, 0.2*inch))

notes_text = """
<b>API Authentication:</b> All calls require Basic Auth header:<br/>
<font face="Courier" size="8">Authorization: Basic MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ</font>
<br/><br/>
<b>Base URL:</b><br/>
<font face="Courier" size="8">https://api.spyfu.com/apis/serp_api/v2/seo/</font>
<br/><br/>
<b>Parameter Format:</b><br/>
• Use <font face="Courier">query</font> parameter (not <font face="Courier">domain</font>)<br/>
• Use <font face="Courier">pageSize</font> parameter to limit rows (controls cost)<br/>
• Example: <font face="Courier" size="8">?query=example.com&amp;pageSize=50</font>
<br/><br/>
<b>Critical Bug Alert:</b><br/>
• <font face="Courier">getLostRanksKeywords</font> returns IMPROVED rankings (negative rankChange)<br/>
• <font face="Courier">getGainedRanksKeywords</font> returns WORSE rankings (positive rankChange)<br/>
• This is counterintuitive - verify in your implementation!
<br/><br/>
<b>Cost Optimization:</b><br/>
• Costs are based on rows returned, NOT total keyword count<br/>
• Enterprise sites cost the same as small sites when using pageSize limits<br/>
• Recommended: Start with pageSize=50-100 per endpoint for ~$0.025-0.05 per call
"""

elements.append(Paragraph(notes_text, body_style))
elements.append(Spacer(1, 0.3*inch))

elements.append(Paragraph("💡 Use Case Recommendations", heading2_style))
use_cases_text = """
<b>For Lead Generation:</b> Use getMostValuableKeywords + getLostRanksKeywords to identify 
high-value opportunities and recent ranking declines (create urgency).<br/><br/>

<b>For Competitive Analysis:</b> Combine getSeoKeywords with getNewlyRankedKeywords to track 
competitor movements and new ranking opportunities.<br/><br/>

<b>For Performance Monitoring:</b> Track getGainedClicksKeywords and getLostClicksKeywords 
over time to measure campaign effectiveness and identify issues early.
"""
elements.append(Paragraph(use_cases_text, body_style))

# Build PDF
print("🎨 Generating highly visual PDF report...")
doc.build(elements, canvasmaker=NumberedCanvas)
print(f"✅ PDF generated successfully: {pdf_filename}")
print(f"📄 File size: {os.path.getsize(pdf_filename) / 1024:.1f} KB")
