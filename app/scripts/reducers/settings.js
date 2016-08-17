import {handleActions} from "redux-actions";
import SettingsRecord from "records/SettingsRecord";
import {Map} from "immutable";

import {
	SAVE_CURRENT_SERVER,
	DELETE_CURRENT_SERVER,
	SAVE_SERVER_URL,
	ADD_SERVER_HEADER,
	DELETE_SERVER_HEADER,
	ADD_SERVER_COOKIE,
	DELETE_SERVER_COOKIE,
	SET_SERVER_METHOD,
	SELECT_SERVER,
	updateBackgroundServer
} from "actions/SettingsActions";

const initialState = new SettingsRecord();

const reducer = handleActions({
	[SAVE_CURRENT_SERVER]: (state) => {
		return state.withMutations(newState => {
			const newEntry = {};
			newEntry[state.currentServer.url] = state.currentServer;
			return newState.setIn(["servers"], newState.servers.merge(new Map(newEntry)));
		});
	},
	[DELETE_CURRENT_SERVER]: (state, action) => {
		return state.withMutations(newState => {
			return newState.setIn(["servers"], newState.servers.delete(action.payload.index));
		});
	},
	[SAVE_SERVER_URL]: (state, action) => {
		const rv = state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.set("url", action.payload.url);
		}));
		updateBackgroundServer(rv.currentServer);
		return rv;
	},
	[ADD_SERVER_HEADER]: (state, action) => {
		const rv = state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.mergeIn(["headers"], new Map(action.payload.header));
		}));
		updateBackgroundServer(rv.currentServer);
		return rv;
	},
	[DELETE_SERVER_HEADER]: (state, action) => {
		return state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.setIn(["headers"], newState.headers.delete(action.payload.key));
		}));
	},
	[ADD_SERVER_COOKIE]: (state, action) => {
		const rv = state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.mergeIn(["cookies"], new Map(action.payload.cookie));
		}));
		updateBackgroundServer(rv.currentServer);
		return rv;
	},
	[DELETE_SERVER_COOKIE]: (state, action) => {
		const rv = state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.deleteIn(["cookies"], action.payload.key);
		}));
		updateBackgroundServer(rv.currentServer);
		return rv;
	},
	[SET_SERVER_METHOD]: (state, action) => {
		const rv = state.set("currentServer", state.currentServer.withMutations(newState => {
			return newState.set("method", action.payload.method);
		}));
		updateBackgroundServer(rv.currentServer);
		return rv;
	},
	[SELECT_SERVER]: (state, action) => {
		const rv = state.set("currentServer", action.payload.server);
		updateBackgroundServer(rv.currentServer);
		return rv;
	}
}, initialState);

export {reducer, updateBackgroundServer};
