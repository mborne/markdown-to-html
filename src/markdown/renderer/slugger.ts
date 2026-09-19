import Slugger from '../../helpers/Slugger.js';

/**
 * Global instance shared by the marked renderer.
 *
 * Note that it is reset by the marked preprocess hook (see ../marked.ts).
 */
const slugger = new Slugger();

export default slugger;
