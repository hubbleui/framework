/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
const RENDER_QUEUE =
{
    /**
    * @internal
    * @type {Component}
    */
    current: null,
};

export default RENDER_QUEUE;