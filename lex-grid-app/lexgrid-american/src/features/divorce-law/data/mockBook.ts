import { Chapter } from "../types";

export const MOCK_BOOK: Chapter[] = [
    {
        id: 'ch1',
        title: 'Chapter 1: Jurisdiction and Conflict of Laws',
        sections: [
            {
                id: 's1-1',
                title: 'Section 1.1: Residency Requirements',
                pages: [
                    { id: 1, content: "Residency requirements for divorce vary significantly across North American jurisdictions. In most US states, at least one spouse must have been a resident of the state for a continuous period, typically six months to one year, immediately preceding the filing of the petition. In Canada, the Divorce Act requires that either spouse has been 'ordinarily resident' in the province for at least one year before the commencement of the proceeding." },
                    { id: 2, content: "Establishing jurisdiction is the primary step in any dissolution proceeding. Failure to meet residency thresholds can lead to dismissal of the case. Practitioners must verify utility bills, tax filings, and driver's licenses to substantiate residency claims. Special considerations apply to military personnel stationed outside their home state or province." }
                ]
            },
            {
                id: 's1-2',
                title: 'Section 1.2: International Service of Process',
                pages: [
                    { id: 3, content: "When one spouse resides in a different country, the Hague Convention on the Service Abroad of Judicial and Extrajudicial Documents in Civil or Commercial Matters applies. This treaty streamlines the process but requires adherence to specific forms and translations. Service must be made through the Central Authority of the receiving state." }
                ]
            }
        ]
    },
    {
        id: 'ch2',
        title: 'Chapter 2: Equitable Distribution & Community Property',
        sections: [
            {
                id: 's2-1',
                title: 'Section 2.1: Defining Marital Assets',
                pages: [
                    { id: 4, content: "Marital assets generally include all property acquired during the marriage, regardless of whose name is on the title. Exceptions include inheritances and gifts from third parties, provided they have not been 'commingled' with marital funds. The distinction between separate and marital property is the most litigated aspect of asset division." },
                    { id: 5, content: "The 'Equitable Distribution' model used in most US states and Canadian provinces does not mean 'equal' distribution. Courts look at factors like the duration of the marriage, each spouse's contribution (including non-financial), and their future earning potential. In Community Property states (e.g., California), the split is strictly 50/50 for marital assets." }
                ]
            },
            {
                id: 's2-2',
                title: 'Section 2.2: Valuation of Professional Practices',
                pages: [
                    { id: 6, content: "Valuing a professional practice or a small business requires forensic accounting. Goodwill—both personal and enterprise—must be carefully calculated. Courts often employ the 'capitalization of excess earnings' method to determine the value that should be considered a marital asset." }
                ]
            }
        ]
    },
    {
        id: 'ch3',
        title: 'Chapter 3: Spousal Support and Alimony',
        sections: [
            {
                id: 's3-1',
                title: 'Section 3.1: Duration and Amount',
                pages: [
                    { id: 7, content: "Spousal support is intended to mitigate the economic impact of divorce. In Canada, the Spousal Support Advisory Guidelines (SSAG) provide a formula based on income and length of marriage. In the USA, many states have moved away from permanent alimony towards 'rehabilitative' support, designed to help a spouse become self-sufficient." }
                ]
            }
        ]
    }
];

