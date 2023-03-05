import {getExperimentBranch} from '#experiments';
import {StoryAdPlacements} from '#experiments/story-ad-placements';

import {CountPagesAlgorithm} from './algorithm-count-pages';
import {PredeterminedPositionAlgorithm} from './algorithm-predetermined';
import {CustomPositionAlgorithm} from './algorithm-custom-pages';

/**
 * Choose placement algorithm implementation.
 * @param {!Window} win
 * @param {!StoryStoreService} storeService
 * @param {!StoryAdPageManager} pageManager
 * @return {!StoryAdPlacementAlgorithm}
 */
export function getPlacementAlgo(win, storeService, pageManager) {
  return new CustomPositionAlgorithm(storeService, pageManager);
}
