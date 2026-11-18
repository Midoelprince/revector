# What users of other vectorizers dislike, and what Revector should do about it

**Sample:** 27 public reviews and comments from 2 sources: Trustpilot (vectorizer.ai has 2 reviews there, Vector Magic 22) and Hacker News. That is too few to rank, but enough to show a direction. The rows are in `reviews.csv` and the ranked output is in `feedback.md` (`reviews.py`).

## 1. What they hate

1. **The pay wall appears only at the download button.** By hand count it is the strongest theme: 12 of 27 rows, 1–2 stars, on both sources.
   - "letting you preview the result only to slap a paywall right at the download button" (https://www.trustpilot.com/reviews/6a8c0fa82ab5356cb15332a6)
   - "Only when you click "Download result" does it say YOU MUST PAY." (https://www.trustpilot.com/reviews/69cfe7e13a94749cd0a16add)
2. **Price and billing:** an expensive one-off licence, refunds, cancelling. 5 rows, Trustpilot only.
3. **Waiting and throttling between images.** 2 rows, thin.
   - "I hate how they throttle the conversion." (https://www.trustpilot.com/reviews/6a2d82f9865e828bcfe93bf5)
4. **Results not sharp or not usable.** 4 rows across both sources.
   - "Images are not even close when copied" (https://www.trustpilot.com/reviews/6a736a3bdbfbca6bad1a5f7f)
5. **Ads on free converters.** 1 row, thin.
   - "SVG vectorizers that are full of ads" (https://news.ycombinator.com/item?id=46898280)

## 2. What is missing
- **Converting many pictures without waiting** between them (thin: 1 review).
- **Trying a sample download before paying** (1 review).

## 3. What is unsolved
People who need a few vectors a month: a subscription or a large licence is too much for them (https://www.trustpilot.com/reviews/6093e1a0f9f4870a78703e55).

## Fix plan for Revector

| # | change | size | evidence |
| --- | --- | --- | --- |
| 1 | Say plainly, on the home page and next to the Download button, that downloads are free, with no account and no watermark. Revector already is free; the complaint is about surprise, so make sure the claim is visible before the first trace. | S | theme 1, 12 rows |
| 2 | Batch: drop several pictures and download all of them with the current settings (a ZIP or one file each). | M | theme 3, thin |
| 3 | Keep the quality work going on photos and scans (2.2.x), and show a before/after on the home page with a scan, not only clean art. | S | theme 4 |
| 4 | Output size and units (px, mm, in) on download, which cutting and print users need. | M | parity gap (`features.csv`) |
| 5 | Stroke-outline export for cutting machines in SVG/PDF. | M | parity gap |

## Angle (recommended)
> For people who need a few clean vectors and hate hitting a pay wall at the download button, Revector traces on your own computer and lets you download every format for free.
>
> Evidence: theme 1, 12 of 27 reviews across 2 sources.
