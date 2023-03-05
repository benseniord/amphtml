import {StoryAdPlacements} from '#experiments/story-ad-placements';

import {StateProperty} from '../../amp-story/1.0/amp-story-store-service';

/**
 * Calculate the indices of where ads should be placed based
 * on story length and the number of ads we want to show.
 * @param {number} storyLength
 * @param {number} desiredAdIndexes
 * @return {!Array<number>}
 * @visibleForTesting
 */
export function getAdPositions(storyLength, desiredAdIndexes) {
  if (!desiredAdIndexes) {
    return [];
  }

  return desiredAdIndexes.filter((idx) => idx < storyLength);
}

/**
 * This algorithm will calculate the number of ads to serve and place them
 * in predermined slots upon initialization.
 * @implements {./algorithm-interface.StoryAdPlacementAlgorithm}
 */
export class CustomPositionAlgorithm {
  /** @override */
  constructor(storeService, pageManager) {
    /** @private {!StoryAdPageManager} */
    this.pageManager_ = pageManager;

    /** @private {!Array<string>} */
    this.storyPageIds_ = storeService.get(StateProperty.PAGE_IDS);

    /** @private {!Array<number>} */
    this.desiredAdPositions_ = [1, 4, 7];

    /** @private {!Array<number>} */
    this.adPositions_ = getAdPositions(
      this.storyPageIds_.length,
      this.desiredAdPositions_
    );
    console.log(`CTOR: Ad positions: ${this.adPositions_}`);

    /** @private {number} */
    this.pagesCreated_ = 0;
  }

  /** @override */
  isStoryEligible() {
    console.log(`isStoryEligible: Ad positions: ${this.adPositions_}`);
    return this.adPositions_ && this.adPositions_.length > 0;
  }

  /** @override */
  initializePages() {
    const storyLength = this.storyPageIds_.length;
    this.adPositions_ = getAdPositions(storyLength, this.desiredAdPositions_);
    console.log(`initializePages: Ad positions: ${this.adPositions_}`);
    if (this.adPositions_) {
      // TODO(ccordry): once 1px impression is launched create all ads at once.
      return [this.createNextPage_()];
    }
    return [];
  }

  /**
   * Create the next ad page to be shown based on predetermined placements.
   */
  createNextPage_() {
    const position = this.adPositions_[this.pagesCreated_];
    const adPage = this.pageManager_.createAdPage();
    adPage.registerLoadCallback(() => {
      // TODO(ccordry): we could maybe try again if insertion fails.
      this.pageManager_
        .maybeInsertPageAfter(this.storyPageIds_[position - 1], adPage)
        .then((res) =>
          console.log(
            `createNextPage: position ${position} after pageId ${
              this.storyPageIds_[position - 1]
            }, res ${res}`
          )
        );
    });
    this.pagesCreated_++;
    return adPage;
  }

  /**
   * This algo does not care about page navigations as positions are calculated
   * upon initialization.
   * @override
   */
  onPageChange(pageId) {}

  /** @override */
  onNewAdView(unusedPageIndex) {
    if (this.pagesCreated_ < this.adPositions_.length) {
      this.createNextPage_();
    }
  }
}
