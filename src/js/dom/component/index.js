import { ACCEPTED_EVENTS, ACCEPTED_PROPS } from './constants';
import { addEventListener, removeEventListener, clearEventListeners, collectGarbage } from './events';
import { attr }  from './attr';
import { attachChildren, Component } from './component';
import { Fragment } from './fragment';

export {
	ACCEPTED_EVENTS,
	ACCEPTED_PROPS,
	addEventListener,
	removeEventListener,
	clearEventListeners,
	collectGarbage,
	attr,
	attachChildren,
	Component,
	Fragment
};

export default Component;