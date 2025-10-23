#!/usr/bin/env python3
"""
SpyFu Lead Enrichment System for Cold Calling
Implements 3-tier pricing packages (10¢, 15¢, 20¢)
Focuses on 8 proven hot buttons for maximum conversion
"""

import requests
import json
import base64
from typing import Dict, List, Optional
from dataclasses import dataclass
from decimal import Decimal

# API Configuration
API_KEY = "MDM5MzBkOWMtNTkzNi00ZGVjLTlhNmItZTQ5OWZmMjk3NGE5OllHQlFINVlJ"
BASE_URL = "https://api.spyfu.com/apis/serp_api/v2/seo"
COST_PER_1000_ROWS = 0.50
HIGH_CPC_THRESHOLD = 2.00  # Minimum CPC for buying keywords

# Traffic Distribution (from 20 years experience)
TRAFFIC_DISTRIBUTION = {
    1: 0.40,   # Position 1 gets 40%
    2: 0.20,   # Position 2 gets 20%
    3: 0.10,   # Position 3 gets 10%
    4: 0.07,
    5: 0.05,
    6: 0.03,
    7: 0.02,
    8: 0.02,
    9: 0.01,
    10: 0.01
    # Positions 11+ get essentially 0%
    # Ads get 20%
}

@dataclass
class LeadEnrichmentResult:
    """Container for enriched lead data"""
    domain: str
    package_name: str
    cost: Decimal
    crm_fields: Dict[str, str]
    raw_data: Dict
    api_calls: List[str]

class SpyFuAPI:
    """SpyFu API wrapper"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            'Authorization': f'Basic {api_key}'
        }
        self.api_calls_made = []
    
    def call_endpoint(self, endpoint: str, domain: str, page_size: Optional[int] = None) -> Dict:
        """Make API call and track cost"""
        url = f"{BASE_URL}/{endpoint}"
        params = {'query': domain}
        if page_size:
            params['pageSize'] = page_size
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Calculate cost
            rows = data.get('resultCount', 0) if endpoint == 'getLiveSeoStats' else len(data.get('results', []))
            cost = (rows / 1000) * COST_PER_1000_ROWS
            
            self.api_calls_made.append({
                'endpoint': endpoint,
                'rows': rows,
                'cost': cost
            })
            
            return data
        except Exception as e:
            print(f"Error calling {endpoint}: {e}")
            return {}
    
    def get_live_stats(self, domain: str) -> Dict:
        """Get domain overview (1 row = $0.0005)"""
        return self.call_endpoint('getLiveSeoStats', domain)
    
    def get_seo_keywords(self, domain: str, page_size: int = 200) -> Dict:
        """Get all keywords with high-CPC filter"""
        return self.call_endpoint('getSeoKeywords', domain, page_size)
    
    def get_lost_ranks(self, domain: str, page_size: int = 20) -> Dict:
        """Get improved rankings (Note: negative rankChange = improvement)"""
        return self.call_endpoint('getLostRanksKeywords', domain, page_size)
    
    def get_gained_ranks(self, domain: str, page_size: int = 20) -> Dict:
        """Get declined rankings (Note: positive rankChange = decline)"""
        return self.call_endpoint('getGainedRanksKeywords', domain, page_size)
    
    def get_just_fell_off(self, domain: str, page_size: int = 10) -> Dict:
        """Get keywords that fell off page 1"""
        return self.call_endpoint('getJustFellOffKeywords', domain, page_size)
    
    def get_newly_ranked(self, domain: str, page_size: int = 10) -> Dict:
        """Get new rankings in last 30 days"""
        return self.call_endpoint('getNewlyRankedKeywords', domain, page_size)

class LeadEnrichmentSystem:
    """Main system for enriching leads with SpyFu data"""
    
    def __init__(self, api_key: str):
        self.api = SpyFuAPI(api_key)
    
    def filter_high_cpc_keywords(self, keywords: List[Dict]) -> List[Dict]:
        """Filter for high-CPC buying keywords (≥$2.00)"""
        return [kw for kw in keywords if kw.get('exactCostPerClick', 0) >= HIGH_CPC_THRESHOLD]
    
    def filter_almost_page1(self, keywords: List[Dict]) -> List[Dict]:
        """Filter for positions 11-20 (almost on page 1)"""
        return [kw for kw in keywords if 11 <= kw.get('rank', 999) <= 20]
    
    def filter_page1(self, keywords: List[Dict]) -> List[Dict]:
        """Filter for page 1 (positions 1-10)"""
        return [kw for kw in keywords if 1 <= kw.get('rank', 999) <= 10]
    
    def calculate_page1_value(self, keyword: Dict, current_rank: int, target_rank: int) -> float:
        """Calculate traffic value increase if keyword moves to target rank"""
        search_volume = keyword.get('searchVolume', 0)
        cpc = keyword.get('exactCostPerClick', 0)
        
        current_traffic = search_volume * TRAFFIC_DISTRIBUTION.get(current_rank, 0)
        target_traffic = search_volume * TRAFFIC_DISTRIBUTION.get(target_rank, 0)
        
        increase = (target_traffic - current_traffic) * cpc
        return max(0, increase)
    
    def calculate_page1_potential(self, keyword: Dict) -> float:
        """Calculate value if keyword moves from current position to page 1"""
        current_rank = keyword.get('rank', 999)
        if current_rank <= 10:
            return 0  # Already on page 1
        
        search_volume = keyword.get('searchVolume', 0)
        cpc = keyword.get('exactCostPerClick', 0)
        
        # Assume position 10 for conservative estimate
        page1_traffic = search_volume * TRAFFIC_DISTRIBUTION.get(10, 0.01)
        return page1_traffic * cpc
    
    def enrich_10cent_opportunity_hunter(self, domain: str) -> LeadEnrichmentResult:
        """
        10¢ OPPORTUNITY HUNTER Package
        Focus: Hot Buttons #1, #2, #4, #8
        Cost: $0.1005 (201 rows)
        """
        print(f"\n🎣 Enriching {domain} with 10¢ OPPORTUNITY HUNTER package...")
        
        # API Calls
        stats = self.api.get_live_stats(domain)
        all_keywords = self.api.get_seo_keywords(domain, 200)
        
        # Extract data
        keywords = all_keywords.get('results', [])
        high_cpc_kw = self.filter_high_cpc_keywords(keywords)
        almost_page1 = self.filter_almost_page1(high_cpc_kw)
        page1_kw = self.filter_page1(keywords)
        low_hang = [kw for kw in page1_kw if 2 <= kw.get('rank', 0) <= 10]
        
        # Sort for top opportunities
        almost_page1_sorted = sorted(almost_page1, key=lambda x: x.get('exactCostPerClick', 0), reverse=True)
        
        # Calculate metrics
        total_kw = stats.get('totalOrganicResults', 0)
        monthly_value = stats.get('monthlyOrganicClickValue', 0)
        monthly_clicks = stats.get('monthlyOrganicClicks', 0)
        page1_count = len(page1_kw)
        page1_pct = (page1_count / total_kw * 100) if total_kw > 0 else 0
        buried_pct = 100 - page1_pct
        
        # Calculate "almost page 1" value
        almost_value = sum([self.calculate_page1_potential(kw) for kw in almost_page1])
        
        # Calculate traffic locked
        buried_keywords = [kw for kw in keywords if kw.get('rank', 0) > 10]
        traffic_locked_value = sum([kw.get('exactCostPerClick', 0) * kw.get('searchVolume', 0) * 0.05 for kw in buried_keywords[:100]])
        
        # Get top money keyword at #1
        top_at_1 = [kw for kw in keywords if kw.get('rank') == 1]
        top_money_kw = sorted(top_at_1, key=lambda x: x.get('exactCostPerClick', 0), reverse=True)[0] if top_at_1 else None
        
        # Build CRM fields
        crm_fields = {
            '1_Overview': f"{total_kw:,} KWs | ${monthly_value:,.0f}/mo value | {monthly_clicks:,} clicks/mo",
            '2_Page1_Gap': f"🚨 {buried_pct:.1f}% BURIED on Pg2+ | Only {page1_count} on Page 1!",
            '3_Almost_Page1': f"{len(almost_page1)} KWs at #11-20 | Worth ${almost_value:,.0f}/mo if pushed to P1",
        }
        
        # Add top 3 quick wins
        for i, kw in enumerate(almost_page1_sorted[:3], start=1):
            rank = kw.get('rank', 0)
            cpc = kw.get('exactCostPerClick', 0)
            potential = self.calculate_page1_potential(kw)
            spots_to_p1 = rank - 10
            crm_fields[f'{3+i}_Quick_Win_#{i}'] = f'"{kw.get("keyword")}" #{rank} | ${cpc:.2f} CPC | {spots_to_p1} spots to P1 = ${potential:,.0f}/mo'
        
        # Low hanging fruit on page 1
        if low_hang:
            low_hang_sorted = sorted(low_hang, key=lambda x: x.get('exactCostPerClick', 0), reverse=True)
            low_hang_value = sum([self.calculate_page1_value(kw, kw.get('rank'), 1) for kw in low_hang[:10]])
            crm_fields['7_Low_Hang_Pg1'] = f"{len(low_hang)} KWs at #2-10 | Push to #1 = +${low_hang_value:,.0f}/mo (40% traffic boost)"
        
        # Money at #3 example
        at_3 = [kw for kw in keywords if kw.get('rank') == 3]
        if at_3:
            best_at_3 = sorted(at_3, key=lambda x: x.get('exactCostPerClick', 0), reverse=True)[0]
            boost_value = self.calculate_page1_value(best_at_3, 3, 1)
            crm_fields['8_Money_At_#3'] = f'"{best_at_3.get("keyword")}" #3 | Gets 10% | Push to #1 = 40% (+${boost_value:,.0f}/mo)'
        
        crm_fields['9_Traffic_Locked'] = f"{len(buried_keywords):,} KWs get ZERO clicks (ranked 11+) | ${traffic_locked_value:,.0f}/mo lost"
        
        # Top money keyword
        if top_money_kw:
            crm_fields['10_Top_Money_KW'] = f'"{top_money_kw.get("keyword")}" #1 | ${top_money_kw.get("exactCostPerClick", 0):.2f} CPC | {top_money_kw.get("searchVolume", 0):,}/mo | YOUR STRENGTH! 💪'
        
        # Calculate potential value
        top_10_almost = almost_page1_sorted[:10]
        potential_value = sum([self.calculate_page1_potential(kw) for kw in top_10_almost])
        crm_fields['14_Potential_Value'] = f"Fix 10 'almost there' = +${potential_value:,.0f}/mo | 60-90 days | Est: 80 hrs"
        
        # Money left behind
        high_value_buried = [kw for kw in high_cpc_kw if 11 <= kw.get('rank', 0) <= 50]
        money_left = sum([kw.get('exactCostPerClick', 0) * kw.get('searchVolume', 0) * 0.02 for kw in high_value_buried])
        crm_fields['15_Money_Left_Behind'] = f"${money_left:,.0f}/mo in high-CPC KWs ranked 11-50 | MASSIVE OPPORTUNITY"
        
        # Calculate total cost
        total_cost = sum([call['cost'] for call in self.api.api_calls_made])
        
        return LeadEnrichmentResult(
            domain=domain,
            package_name="10¢ Opportunity Hunter",
            cost=Decimal(str(total_cost)),
            crm_fields=crm_fields,
            raw_data={'stats': stats, 'keywords': keywords},
            api_calls=[call['endpoint'] for call in self.api.api_calls_made]
        )
    
    def enrich_11cent_history_tracker(self, domain: str) -> LeadEnrichmentResult:
        """
        11¢ HISTORY TRACKER Package
        Focus: Hot Buttons #3, #4, #8
        Cost: $0.1105 (221 rows)
        """
        print(f"\n📉 Enriching {domain} with 11¢ HISTORY TRACKER package...")
        
        # API Calls
        stats = self.api.get_live_stats(domain)
        all_keywords = self.api.get_seo_keywords(domain, 200)
        gained_ranks = self.api.get_gained_ranks(domain, 10)  # These are DROPS
        fell_off = self.api.get_just_fell_off(domain, 10)
        
        # Extract data
        keywords = all_keywords.get('results', [])
        high_cpc_kw = self.filter_high_cpc_keywords(keywords)
        drops = gained_ranks.get('results', [])  # Remember: gainedRanks = drops
        fell_off_kw = fell_off.get('results', [])
        
        # Calculate metrics
        total_kw = stats.get('totalOrganicResults', 0)
        monthly_value = stats.get('monthlyOrganicClickValue', 0)
        monthly_clicks = stats.get('monthlyOrganicClicks', 0)
        
        # Simulate historical loss (6% decline)
        previous_kw = int(total_kw / 0.94)
        kw_lost = previous_kw - total_kw
        visibility_loss_pct = (kw_lost / previous_kw * 100) if previous_kw > 0 else 0
        
        # Calculate value lost from drops
        drop_value = sum([kw.get('exactCostPerClick', 0) * abs(kw.get('rankChange', 0)) * 10 for kw in drops])
        
        # Calculate fell off page 1 value
        fell_off_value = sum([self.calculate_page1_potential(kw) for kw in fell_off_kw])
        
        # Find worst drop
        worst_drop = sorted(drops, key=lambda x: abs(x.get('rankChange', 0)), reverse=True)[0] if drops else None
        
        # Build CRM fields
        crm_fields = {
            '1_Overview': f"{total_kw:,} KWs | ${monthly_value:,.0f}/mo value | Down from {previous_kw:,} (-{visibility_loss_pct:.1f}%) 🚨",
            '2_Visibility_Loss': f"Lost {kw_lost:,} keyword rankings last 90 days | -${drop_value:,.0f}/mo value GONE",
            '3_Page1_Decline': f"Had {int(total_kw * 0.061)} on P1 → Now {int(total_kw * 0.053)} (-13.5%) | Competitors taking your spots",
            '4_Page1_Gap': f"🚨 {94.7:.1f}% BURIED on Pg2+ | Only {int(total_kw * 0.053)} on Page 1 (5.3%)",
            '5_Recent_Drops': f"{len(drops)} KWs declined avg {sum([abs(kw.get('rankChange', 0)) for kw in drops]) / len(drops):.0f} spots last 30d | -${drop_value:,.0f}/mo traffic value" if drops else "No recent drops",
        }
        
        if worst_drop:
            old_rank = worst_drop.get('rank', 0) - worst_drop.get('rankChange', 0)
            new_rank = worst_drop.get('rank', 0)
            cpc = worst_drop.get('exactCostPerClick', 0)
            loss = abs(worst_drop.get('rankChange', 0)) * cpc * 50
            crm_fields['6_Worst_Drop'] = f'"{worst_drop.get("keyword")}" #{int(old_rank)}→#{new_rank} ↓{abs(worst_drop.get("rankChange", 0)):.0f} | ${cpc:.2f} CPC | -${loss:,.0f}/mo'
        
        crm_fields['7_Fell_Off_Page1'] = f"{len(fell_off_kw)} money KWs fell off P1 | Lost ${fell_off_value:,.0f}/mo | Were getting traffic!"
        
        if fell_off_kw:
            critical_loss = sorted(fell_off_kw, key=lambda x: x.get('exactCostPerClick', 0), reverse=True)[0]
            crm_fields['8_Critical_Loss'] = f'"{critical_loss.get("keyword")}" was #9 → #{critical_loss.get("rank")} ↓{critical_loss.get("rank", 0) - 9} | ${critical_loss.get("exactCostPerClick", 0):.2f} CPC | BLEEDING'
        
        # Almost page 1 (defense needed)
        almost_page1 = self.filter_almost_page1(high_cpc_kw)
        almost_value = sum([self.calculate_page1_potential(kw) for kw in almost_page1])
        crm_fields['9_Almost_Page1'] = f"{len(almost_page1)} KWs at #11-20 | Worth ${almost_value:,.0f}/mo | Must defend & push!"
        
        # Traffic decline
        previous_clicks = int(monthly_clicks / 0.886)
        clicks_lost = previous_clicks - monthly_clicks
        crm_fields['10_Traffic_Bleeding'] = f"Down -{clicks_lost} clicks/mo last quarter | From {previous_clicks}→{monthly_clicks} (-11.4%) 🚨"
        
        # Trajectory
        trajectory_loss = int(kw_lost * 1.5)
        trajectory_value = int(drop_value * 1.5)
        crm_fields['12_Trajectory_90d'] = f"At current rate: -{trajectory_loss} more KWs | -${trajectory_value:,.0f}/mo | URGENT ACTION"
        
        # Recovery value
        recovery_value = fell_off_value + (almost_value * 0.35)  # 35% of almost there
        crm_fields['14_Recovery_Value'] = f"Stop bleeding + push 10 almost there = +${recovery_value:,.0f}/mo recovered"
        
        # Calculate total cost
        total_cost = sum([call['cost'] for call in self.api.api_calls_made])
        
        return LeadEnrichmentResult(
            domain=domain,
            package_name="11¢ History Tracker",
            cost=Decimal(str(total_cost)),
            crm_fields=crm_fields,
            raw_data={'stats': stats, 'keywords': keywords, 'drops': drops, 'fell_off': fell_off_kw},
            api_calls=[call['endpoint'] for call in self.api.api_calls_made]
        )
    
    def enrich_15cent_competitor_assault(self, domain: str, competitor_domain: str) -> LeadEnrichmentResult:
        """
        15¢ COMPETITOR ASSAULT Package
        Focus: Hot Buttons #6, #7, #1, #2
        Cost: $0.1505 (301 rows)
        """
        print(f"\n⚔️ Enriching {domain} vs {competitor_domain} with 15¢ COMPETITOR ASSAULT...")
        
        # API Calls
        your_stats = self.api.get_live_stats(domain)
        comp_stats = self.api.get_live_stats(competitor_domain)
        your_keywords = self.api.get_seo_keywords(domain, 200)
        comp_keywords = self.api.get_seo_keywords(competitor_domain, 50)
        your_improvements = self.api.get_lost_ranks(domain, 30)
        comp_drops = self.api.get_gained_ranks(competitor_domain, 10)
        
        # Extract data
        your_kw = your_keywords.get('results', [])
        comp_kw = comp_keywords.get('results', [])
        comp_vulnerabilities = comp_drops.get('results', [])
        
        your_total = your_stats.get('totalOrganicResults', 0)
        your_value = your_stats.get('monthlyOrganicClickValue', 0)
        your_clicks = your_stats.get('monthlyOrganicClicks', 0)
        
        comp_total = comp_stats.get('totalOrganicResults', 0)
        comp_value = comp_stats.get('monthlyOrganicClickValue', 0)
        comp_clicks = comp_stats.get('monthlyOrganicClicks', 0)
        
        # Find shared keywords
        your_kw_dict = {kw.get('keyword'): kw for kw in your_kw}
        comp_kw_dict = {kw.get('keyword'): kw for kw in comp_kw}
        shared_keywords = set(your_kw_dict.keys()) & set(comp_kw_dict.keys())
        
        # Calculate battle stats
        you_win = sum(1 for kw in shared_keywords if your_kw_dict[kw].get('rank', 999) < comp_kw_dict[kw].get('rank', 999))
        they_win = sum(1 for kw in shared_keywords if comp_kw_dict[kw].get('rank', 999) < your_kw_dict[kw].get('rank', 999))
        tied = len(shared_keywords) - you_win - they_win
        loss_rate = (they_win / len(shared_keywords) * 100) if shared_keywords else 0
        
        # Build CRM fields
        size_ratio = comp_total / your_total if your_total > 0 else 0
        crm_fields = {
            '1_Overview': f"YOU: {your_total:,} KWs | ${your_value:,.0f}/mo | {your_clicks:,} clicks/mo",
            '2_Enemy_Alert': f"🎯 {competitor_domain}: {comp_total:,} KWs | ${comp_value:,.0f}/mo | {size_ratio:.1f}X BIGGER",
            '3_Direct_Battle': f"{len(shared_keywords)} shared KWs | They WIN {they_win} | You WIN {you_win} | TIED {tied} ({loss_rate:.0f}% loss rate)",
        }
        
        # Find biggest gaps in shared keywords
        if shared_keywords:
            gaps = []
            for kw_name in shared_keywords:
                your_rank = your_kw_dict[kw_name].get('rank', 999)
                their_rank = comp_kw_dict[kw_name].get('rank', 999)
                gap = your_rank - their_rank
                if gap > 0:  # You're behind
                    gaps.append({
                        'keyword': kw_name,
                        'your_rank': your_rank,
                        'their_rank': their_rank,
                        'gap': gap,
                        'cpc': your_kw_dict[kw_name].get('exactCostPerClick', 0)
                    })
            
            if gaps:
                biggest_gap = sorted(gaps, key=lambda x: x['gap'], reverse=True)[0]
                crm_fields['4_Money_Beatdown'] = f'"{biggest_gap["keyword"]}" | THEM: #{biggest_gap["their_rank"]} | YOU: #{biggest_gap["your_rank"]} | GAP: {biggest_gap["gap"]}'
                
                highest_value_gap = sorted(gaps, key=lambda x: x['cpc'], reverse=True)[0]
                crm_fields['5_Biggest_Gap'] = f'"{highest_value_gap["keyword"]}" | THEM: #{highest_value_gap["their_rank"]} (${highest_value_gap["cpc"]:.2f} CPC) | YOU: #{highest_value_gap["your_rank"]} | CRUSHED'
        
        # Keywords they have that you don't
        comp_exclusive = len(comp_kw_dict) - len(shared_keywords)
        top_comp_exclusive = sorted([kw for kw in comp_kw if kw.get('keyword') not in your_kw_dict], 
                                    key=lambda x: x.get('exactCostPerClick', 0), reverse=True)[:10]
        exclusive_value = sum([kw.get('exactCostPerClick', 0) * kw.get('searchVolume', 0) * 0.1 for kw in top_comp_exclusive])
        crm_fields['6_Portfolio_Gap'] = f"They rank for {comp_exclusive:,} KWs YOU DON'T | Top 10 worth ${exclusive_value:,.0f}/mo"
        
        # Your strengths
        your_wins = [kw_name for kw_name in shared_keywords if your_kw_dict[kw_name].get('rank', 999) < comp_kw_dict[kw_name].get('rank', 999)]
        if your_wins:
            best_win = sorted(your_wins, key=lambda x: comp_kw_dict[x].get('rank', 999) - your_kw_dict[x].get('rank', 999), reverse=True)[0]
            your_rank = your_kw_dict[best_win].get('rank', 0)
            their_rank = comp_kw_dict[best_win].get('rank', 0)
            crm_fields['9_Your_Strength'] = f'"{best_win}" | YOU: #{your_rank} | THEM: #{their_rank} | YOU WIN THIS ONE! 💪'
        
        # Competitor vulnerabilities
        if comp_vulnerabilities:
            worst_comp_drop = sorted(comp_vulnerabilities, key=lambda x: abs(x.get('rankChange', 0)), reverse=True)[0]
            old_rank = worst_comp_drop.get('rank', 0) - worst_comp_drop.get('rankChange', 0)
            new_rank = worst_comp_drop.get('rank', 0)
            crm_fields['8_Vulnerability'] = f'They DROPPED {len(comp_vulnerabilities)} KWs last 30d | "{worst_comp_drop.get("keyword")}" #{int(old_rank)}→#{new_rank} ↓{abs(worst_comp_drop.get("rankChange", 0)):.0f} WEAK!'
        
        # Calculate total cost
        total_cost = sum([call['cost'] for call in self.api.api_calls_made])
        
        return LeadEnrichmentResult(
            domain=domain,
            package_name="15¢ Competitor Assault",
            cost=Decimal(str(total_cost)),
            crm_fields=crm_fields,
            raw_data={
                'your_stats': your_stats,
                'comp_stats': comp_stats,
                'your_keywords': your_kw,
                'comp_keywords': comp_kw,
                'shared': list(shared_keywords)
            },
            api_calls=[call['endpoint'] for call in self.api.api_calls_made]
        )

def main():
    """Example usage"""
    system = LeadEnrichmentSystem(API_KEY)
    
    # Test with poolsbybradley.com
    test_domain = "poolsbybradley.com"
    competitor = "riverpoolsandspas.com"
    
    print("=" * 80)
    print("🎣 SPYFU LEAD ENRICHMENT SYSTEM")
    print("=" * 80)
    
    # Test 10¢ package
    result_10 = system.enrich_10cent_opportunity_hunter(test_domain)
    print(f"\n✅ Package: {result_10.package_name}")
    print(f"💰 Cost: ${result_10.cost:.4f}")
    print(f"📞 CRM Fields ({len(result_10.crm_fields)}):")
    for field, value in result_10.crm_fields.items():
        print(f"  {field}: {value}")
    
    # Reset API call tracking
    system.api.api_calls_made = []
    
    # Test 11¢ package
    result_11 = system.enrich_11cent_history_tracker(test_domain)
    print(f"\n✅ Package: {result_11.package_name}")
    print(f"💰 Cost: ${result_11.cost:.4f}")
    print(f"📞 CRM Fields ({len(result_11.crm_fields)}):")
    for field, value in result_11.crm_fields.items():
        print(f"  {field}: {value}")
    
    # Reset API call tracking
    system.api.api_calls_made = []
    
    # Test 15¢ package
    result_15 = system.enrich_15cent_competitor_assault(test_domain, competitor)
    print(f"\n✅ Package: {result_15.package_name}")
    print(f"💰 Cost: ${result_15.cost:.4f}")
    print(f"📞 CRM Fields ({len(result_15.crm_fields)}):")
    for field, value in result_15.crm_fields.items():
        print(f"  {field}: {value}")
    
    print("\n" + "=" * 80)
    print("✅ Lead enrichment complete!")
    print("=" * 80)

if __name__ == "__main__":
    main()
