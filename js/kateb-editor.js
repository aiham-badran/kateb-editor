import { AllSelection as e, EditorState as t, NodeSelection as n, Plugin as r, PluginKey as i, Selection as a, SelectionRange as o, TextSelection as s } from "prosemirror-state";
import { EditorView as c } from "prosemirror-view";
import { DOMParser as l, Fragment as u, ReplaceError as d, Schema as f, Slice as p } from "prosemirror-model";
for (var m = Object.defineProperty, h = (e, t) => {
	let n = {};
	for (var r in e) m(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || m(n, Symbol.toStringTag, { value: "Module" }), n;
}, g = {
	8: "Backspace",
	9: "Tab",
	10: "Enter",
	12: "NumLock",
	13: "Enter",
	16: "Shift",
	17: "Control",
	18: "Alt",
	20: "CapsLock",
	27: "Escape",
	32: " ",
	33: "PageUp",
	34: "PageDown",
	35: "End",
	36: "Home",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	44: "PrintScreen",
	45: "Insert",
	46: "Delete",
	59: ";",
	61: "=",
	91: "Meta",
	92: "Meta",
	106: "*",
	107: "+",
	108: ",",
	109: "-",
	110: ".",
	111: "/",
	144: "NumLock",
	145: "ScrollLock",
	160: "Shift",
	161: "Shift",
	162: "Control",
	163: "Control",
	164: "Alt",
	165: "Alt",
	173: "-",
	186: ";",
	187: "=",
	188: ",",
	189: "-",
	190: ".",
	191: "/",
	192: "`",
	219: "[",
	220: "\\",
	221: "]",
	222: "'"
}, _ = {
	48: ")",
	49: "!",
	50: "@",
	51: "#",
	52: "$",
	53: "%",
	54: "^",
	55: "&",
	56: "*",
	57: "(",
	59: ":",
	61: "+",
	173: "_",
	186: ":",
	187: "+",
	188: "<",
	189: "_",
	190: ">",
	191: "?",
	192: "~",
	219: "{",
	220: "|",
	221: "}",
	222: "\""
}, ee = typeof navigator < "u" && /Mac/.test(navigator.platform), te = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), v = 0; v < 10; v++) g[48 + v] = g[96 + v] = String(v);
for (var v = 1; v <= 24; v++) g[v + 111] = "F" + v;
for (var v = 65; v <= 90; v++) g[v] = String.fromCharCode(v + 32), _[v] = String.fromCharCode(v);
for (var y in g) _.hasOwnProperty(y) || (_[y] = g[y]);
function ne(e) {
	var t = !(ee && e.metaKey && e.shiftKey && !e.ctrlKey && !e.altKey || te && e.shiftKey && e.key && e.key.length == 1 || e.key == "Unidentified") && e.key || (e.shiftKey ? _ : g)[e.keyCode] || e.key || "Unidentified";
	return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
//#endregion
//#region node_modules/prosemirror-keymap/dist/index.js
var re = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), ie = typeof navigator < "u" && /Win/.test(navigator.platform);
function ae(e) {
	let t = e.split(/-(?!$)/), n = t[t.length - 1];
	n == "Space" && (n = " ");
	let r, i, a, o;
	for (let e = 0; e < t.length - 1; e++) {
		let n = t[e];
		if (/^(cmd|meta|m)$/i.test(n)) o = !0;
		else if (/^a(lt)?$/i.test(n)) r = !0;
		else if (/^(c|ctrl|control)$/i.test(n)) i = !0;
		else if (/^s(hift)?$/i.test(n)) a = !0;
		else if (/^mod$/i.test(n)) re ? o = !0 : i = !0;
		else throw Error("Unrecognized modifier name: " + n);
	}
	return r && (n = "Alt-" + n), i && (n = "Ctrl-" + n), o && (n = "Meta-" + n), a && (n = "Shift-" + n), n;
}
function oe(e) {
	let t = Object.create(null);
	for (let n in e) t[ae(n)] = e[n];
	return t;
}
function b(e, t, n = !0) {
	return t.altKey && (e = "Alt-" + e), t.ctrlKey && (e = "Ctrl-" + e), t.metaKey && (e = "Meta-" + e), n && t.shiftKey && (e = "Shift-" + e), e;
}
function se(e) {
	return new r({ props: { handleKeyDown: ce(e) } });
}
function ce(e) {
	let t = oe(e);
	return function(e, n) {
		let r = ne(n), i, a = t[b(r, n)];
		if (a && a(e.state, e.dispatch, e)) return !0;
		if (r.length == 1 && r != " ") {
			if (n.shiftKey) {
				let i = t[b(r, n, !1)];
				if (i && i(e.state, e.dispatch, e)) return !0;
			}
			if ((n.altKey || n.metaKey || n.ctrlKey) && !(ie && n.ctrlKey && n.altKey) && (i = g[n.keyCode]) && i != r) {
				let r = t[b(i, n)];
				if (r && r(e.state, e.dispatch, e)) return !0;
			}
		}
		return !1;
	};
}
//#endregion
//#region node_modules/prosemirror-transform/dist/index.js
var le = 65535, ue = 2 ** 16;
function de(e, t) {
	return e + t * ue;
}
function fe(e) {
	return e & le;
}
function pe(e) {
	return (e - (e & le)) / ue;
}
var me = 1, he = 2, x = 4, ge = 8, S = class {
	constructor(e, t, n) {
		this.pos = e, this.delInfo = t, this.recover = n;
	}
	get deleted() {
		return (this.delInfo & ge) > 0;
	}
	get deletedBefore() {
		return (this.delInfo & (me | x)) > 0;
	}
	get deletedAfter() {
		return (this.delInfo & (he | x)) > 0;
	}
	get deletedAcross() {
		return (this.delInfo & x) > 0;
	}
}, C = class e {
	constructor(t, n = !1) {
		if (this.ranges = t, this.inverted = n, !t.length && e.empty) return e.empty;
	}
	recover(e) {
		let t = 0, n = fe(e);
		if (!this.inverted) for (let e = 0; e < n; e++) t += this.ranges[e * 3 + 2] - this.ranges[e * 3 + 1];
		return this.ranges[n * 3] + t + pe(e);
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	map(e, t = 1) {
		return this._map(e, t, !0);
	}
	_map(e, t, n) {
		let r = 0, i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let o = 0; o < this.ranges.length; o += 3) {
			let s = this.ranges[o] - (this.inverted ? r : 0);
			if (s > e) break;
			let c = this.ranges[o + i], l = this.ranges[o + a], u = s + c;
			if (e <= u) {
				let i = c ? e == s ? -1 : e == u ? 1 : t : t, a = s + r + (i < 0 ? 0 : l);
				if (n) return a;
				let d = e == (t < 0 ? s : u) ? null : de(o / 3, e - s), f = e == s ? he : e == u ? me : x;
				return (t < 0 ? e != s : e != u) && (f |= ge), new S(a, f, d);
			}
			r += l - c;
		}
		return n ? e + r : new S(e + r, 0, null);
	}
	touches(e, t) {
		let n = 0, r = fe(t), i = this.inverted ? 2 : 1, a = this.inverted ? 1 : 2;
		for (let t = 0; t < this.ranges.length; t += 3) {
			let o = this.ranges[t] - (this.inverted ? n : 0);
			if (o > e) break;
			let s = this.ranges[t + i];
			if (e <= o + s && t == r * 3) return !0;
			n += this.ranges[t + a] - s;
		}
		return !1;
	}
	forEach(e) {
		let t = this.inverted ? 2 : 1, n = this.inverted ? 1 : 2;
		for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
			let a = this.ranges[r], o = a - (this.inverted ? i : 0), s = a + (this.inverted ? 0 : i), c = this.ranges[r + t], l = this.ranges[r + n];
			e(o, o + c, s, s + l), i += l - c;
		}
	}
	invert() {
		return new e(this.ranges, !this.inverted);
	}
	toString() {
		return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
	}
	static offset(t) {
		return t == 0 ? e.empty : new e(t < 0 ? [
			0,
			-t,
			0
		] : [
			0,
			0,
			t
		]);
	}
};
C.empty = new C([]);
var _e = class e {
	constructor(e, t, n = 0, r = e ? e.length : 0) {
		this.mirror = t, this.from = n, this.to = r, this._maps = e || [], this.ownData = !(e || t);
	}
	get maps() {
		return this._maps;
	}
	slice(t = 0, n = this.maps.length) {
		return new e(this._maps, this.mirror, t, n);
	}
	appendMap(e, t) {
		this.ownData ||= (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
	}
	appendMapping(e) {
		for (let t = 0, n = this._maps.length; t < e._maps.length; t++) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t], r != null && r < t ? n + r : void 0);
		}
	}
	getMirror(e) {
		if (this.mirror) {
			for (let t = 0; t < this.mirror.length; t++) if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
		}
	}
	setMirror(e, t) {
		this.mirror ||= [], this.mirror.push(e, t);
	}
	appendMappingInverted(e) {
		for (let t = e.maps.length - 1, n = this._maps.length + e._maps.length; t >= 0; t--) {
			let r = e.getMirror(t);
			this.appendMap(e._maps[t].invert(), r != null && r > t ? n - r - 1 : void 0);
		}
	}
	invert() {
		let t = new e();
		return t.appendMappingInverted(this), t;
	}
	map(e, t = 1) {
		if (this.mirror) return this._map(e, t, !0);
		for (let n = this.from; n < this.to; n++) e = this._maps[n].map(e, t);
		return e;
	}
	mapResult(e, t = 1) {
		return this._map(e, t, !1);
	}
	_map(e, t, n) {
		let r = 0;
		for (let n = this.from; n < this.to; n++) {
			let i = this._maps[n].mapResult(e, t);
			if (i.recover != null) {
				let t = this.getMirror(n);
				if (t != null && t > n && t < this.to) {
					n = t, e = this._maps[t].recover(i.recover);
					continue;
				}
			}
			r |= i.delInfo, e = i.pos;
		}
		return n ? e : new S(e, r, null);
	}
}, ve = Object.create(null), w = class {
	getMap() {
		return C.empty;
	}
	merge(e) {
		return null;
	}
	static fromJSON(e, t) {
		if (!t || !t.stepType) throw RangeError("Invalid input for Step.fromJSON");
		let n = ve[t.stepType];
		if (!n) throw RangeError(`No step type ${t.stepType} defined`);
		return n.fromJSON(e, t);
	}
	static jsonID(e, t) {
		if (e in ve) throw RangeError("Duplicate use of step JSON ID " + e);
		return ve[e] = t, t.prototype.jsonID = e, t;
	}
}, T = class e {
	constructor(e, t) {
		this.doc = e, this.failed = t;
	}
	static ok(t) {
		return new e(t, null);
	}
	static fail(t) {
		return new e(null, t);
	}
	static fromReplace(t, n, r, i) {
		try {
			return e.ok(t.replace(n, r, i));
		} catch (t) {
			if (t instanceof d) return e.fail(t.message);
			throw t;
		}
	}
};
function E(e, t, n) {
	let r = [];
	for (let i = 0; i < e.childCount; i++) {
		let a = e.child(i);
		a.content.size && (a = a.copy(E(a.content, t, a))), a.isInline && (a = t(a, n, i)), r.push(a);
	}
	return u.fromArray(r);
}
var ye = class e extends w {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = e.resolve(this.from), r = n.node(n.sharedDepth(this.to)), i = new p(E(t.content, (e, t) => !e.isAtom || !t.type.allowsMarkType(this.mark.type) ? e : e.mark(this.mark.addToSet(e.marks)), r), t.openStart, t.openEnd);
		return T.fromReplace(e, this.from, this.to, i);
	}
	invert() {
		return new be(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "addMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for AddMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
w.jsonID("addMark", ye);
var be = class e extends w {
	constructor(e, t, n) {
		super(), this.from = e, this.to = t, this.mark = n;
	}
	apply(e) {
		let t = e.slice(this.from, this.to), n = new p(E(t.content, (e) => e.mark(this.mark.removeFromSet(e.marks)), e), t.openStart, t.openEnd);
		return T.fromReplace(e, this.from, this.to, n);
	}
	invert() {
		return new ye(this.from, this.to, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deleted && r.deleted || n.pos >= r.pos ? null : new e(n.pos, r.pos, this.mark);
	}
	merge(t) {
		return t instanceof e && t.mark.eq(this.mark) && this.from <= t.to && this.to >= t.from ? new e(Math.min(this.from, t.from), Math.max(this.to, t.to), this.mark) : null;
	}
	toJSON() {
		return {
			stepType: "removeMark",
			mark: this.mark.toJSON(),
			from: this.from,
			to: this.to
		};
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for RemoveMarkStep.fromJSON");
		return new e(n.from, n.to, t.markFromJSON(n.mark));
	}
};
w.jsonID("removeMark", be);
var xe = class e extends w {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
		return T.fromReplace(e, this.pos, this.pos + 1, new p(u.from(n), 0, t.isLeaf ? 0 : 1));
	}
	invert(t) {
		let n = t.nodeAt(this.pos);
		if (n) {
			let t = this.mark.addToSet(n.marks);
			if (t.length == n.marks.length) {
				for (let r = 0; r < n.marks.length; r++) if (!n.marks[r].isInSet(t)) return new e(this.pos, n.marks[r]);
				return new e(this.pos, this.mark);
			}
		}
		return new Se(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "addNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for AddNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
w.jsonID("addNodeMark", xe);
var Se = class e extends w {
	constructor(e, t) {
		super(), this.pos = e, this.mark = t;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at mark step's position");
		let n = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
		return T.fromReplace(e, this.pos, this.pos + 1, new p(u.from(n), 0, t.isLeaf ? 0 : 1));
	}
	invert(e) {
		let t = e.nodeAt(this.pos);
		return !t || !this.mark.isInSet(t.marks) ? this : new xe(this.pos, this.mark);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.mark);
	}
	toJSON() {
		return {
			stepType: "removeNodeMark",
			pos: this.pos,
			mark: this.mark.toJSON()
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
		return new e(n.pos, t.markFromJSON(n.mark));
	}
};
w.jsonID("removeNodeMark", Se);
var D = class e extends w {
	constructor(e, t, n, r = !1) {
		super(), this.from = e, this.to = t, this.slice = n, this.structure = r;
	}
	apply(e) {
		return this.structure && Ce(e, this.from, this.to) ? T.fail("Structure replace would overwrite content") : T.fromReplace(e, this.from, this.to, this.slice);
	}
	getMap() {
		return new C([
			this.from,
			this.to - this.from,
			this.slice.size
		]);
	}
	invert(t) {
		return new e(this.from, this.from + this.slice.size, t.slice(this.from, this.to));
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1);
		return n.deletedAcross && r.deletedAcross ? null : new e(n.pos, Math.max(n.pos, r.pos), this.slice, this.structure);
	}
	merge(t) {
		if (!(t instanceof e) || t.structure || this.structure) return null;
		if (this.from + this.slice.size == t.from && !this.slice.openEnd && !t.slice.openStart) {
			let n = this.slice.size + t.slice.size == 0 ? p.empty : new p(this.slice.content.append(t.slice.content), this.slice.openStart, t.slice.openEnd);
			return new e(this.from, this.to + (t.to - t.from), n, this.structure);
		} else if (t.to == this.from && !this.slice.openStart && !t.slice.openEnd) {
			let n = this.slice.size + t.slice.size == 0 ? p.empty : new p(t.slice.content.append(this.slice.content), t.slice.openStart, this.slice.openEnd);
			return new e(t.from, this.to, n, this.structure);
		} else return null;
	}
	toJSON() {
		let e = {
			stepType: "replace",
			from: this.from,
			to: this.to
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number") throw RangeError("Invalid input for ReplaceStep.fromJSON");
		return new e(n.from, n.to, p.fromJSON(t, n.slice), !!n.structure);
	}
};
w.jsonID("replace", D);
var O = class e extends w {
	constructor(e, t, n, r, i, a, o = !1) {
		super(), this.from = e, this.to = t, this.gapFrom = n, this.gapTo = r, this.slice = i, this.insert = a, this.structure = o;
	}
	apply(e) {
		if (this.structure && (Ce(e, this.from, this.gapFrom) || Ce(e, this.gapTo, this.to))) return T.fail("Structure gap-replace would overwrite content");
		let t = e.slice(this.gapFrom, this.gapTo);
		if (t.openStart || t.openEnd) return T.fail("Gap is not a flat range");
		let n = this.slice.insertAt(this.insert, t.content);
		return n ? T.fromReplace(e, this.from, this.to, n) : T.fail("Content does not fit in gap");
	}
	getMap() {
		return new C([
			this.from,
			this.gapFrom - this.from,
			this.insert,
			this.gapTo,
			this.to - this.gapTo,
			this.slice.size - this.insert
		]);
	}
	invert(t) {
		let n = this.gapTo - this.gapFrom;
		return new e(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, t.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
	}
	map(t) {
		let n = t.mapResult(this.from, 1), r = t.mapResult(this.to, -1), i = this.from == this.gapFrom ? n.pos : t.map(this.gapFrom, -1), a = this.to == this.gapTo ? r.pos : t.map(this.gapTo, 1);
		return n.deletedAcross && r.deletedAcross || i < n.pos || a > r.pos ? null : new e(n.pos, r.pos, i, a, this.slice, this.insert, this.structure);
	}
	toJSON() {
		let e = {
			stepType: "replaceAround",
			from: this.from,
			to: this.to,
			gapFrom: this.gapFrom,
			gapTo: this.gapTo,
			insert: this.insert
		};
		return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
	}
	static fromJSON(t, n) {
		if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number") throw RangeError("Invalid input for ReplaceAroundStep.fromJSON");
		return new e(n.from, n.to, n.gapFrom, n.gapTo, p.fromJSON(t, n.slice), n.insert, !!n.structure);
	}
};
w.jsonID("replaceAround", O);
function Ce(e, t, n) {
	let r = e.resolve(t), i = n - t, a = r.depth;
	for (; i > 0 && a > 0 && r.indexAfter(a) == r.node(a).childCount;) a--, i--;
	if (i > 0) {
		let e = r.node(a).maybeChild(r.indexAfter(a));
		for (; i > 0;) {
			if (!e || e.isLeaf) return !0;
			e = e.firstChild, i--;
		}
	}
	return !1;
}
function we(e, t, n) {
	return (t == 0 || e.canReplace(t, e.childCount)) && (n == e.childCount || e.canReplace(0, n));
}
function Te(e) {
	let t = e.parent.content.cutByIndex(e.startIndex, e.endIndex);
	for (let n = e.depth, r = 0, i = 0;; --n) {
		let a = e.$from.node(n), o = e.$from.index(n) + r, s = e.$to.indexAfter(n) - i;
		if (n < e.depth && a.canReplace(o, s, t)) return n;
		if (n == 0 || a.type.spec.isolating || !we(a, o, s)) break;
		o && (r = 1), s < a.childCount && (i = 1);
	}
	return null;
}
function k(e, t, n = 1, r) {
	let i = e.resolve(t), a = i.depth - n, o = r && r[r.length - 1] || i.parent;
	if (a < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount))) return !1;
	for (let e = i.depth - 1, t = n - 2; e > a; e--, t--) {
		let n = i.node(e), a = i.index(e);
		if (n.type.spec.isolating) return !1;
		let o = n.content.cutByIndex(a, n.childCount), s = r && r[t + 1];
		s && (o = o.replaceChild(0, s.type.create(s.attrs)));
		let c = r && r[t] || n;
		if (!n.canReplace(a + 1, n.childCount) || !c.type.validContent(o)) return !1;
	}
	let s = i.indexAfter(a), c = r && r[0];
	return i.node(a).canReplaceWith(s, s, c ? c.type : i.node(a + 1).type);
}
function Ee(e, t) {
	let n = e.resolve(t), r = n.index();
	return Oe(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function De(e, t) {
	t.content.size || e.type.compatibleContent(t.type);
	let n = e.contentMatchAt(e.childCount), { linebreakReplacement: r } = e.type.schema;
	for (let i = 0; i < t.childCount; i++) {
		let a = t.child(i), o = a.type == r ? e.type.schema.nodes.text : a.type;
		if (n = n.matchType(o), !n || !e.type.allowsMarks(a.marks)) return !1;
	}
	return n.validEnd;
}
function Oe(e, t) {
	return !!(e && t && !e.isLeaf && De(e, t));
}
function ke(e, t, n = t, r = p.empty) {
	if (t == n && !r.size) return null;
	let i = e.resolve(t), a = e.resolve(n);
	return Ae(i, a, r) ? new D(t, n, r) : new je(i, a, r).fit();
}
function Ae(e, t, n) {
	return !n.openStart && !n.openEnd && e.start() == t.start() && e.parent.canReplace(e.index(), t.index(), n.content);
}
var je = class {
	constructor(e, t, n) {
		this.$from = e, this.$to = t, this.unplaced = n, this.frontier = [], this.placed = u.empty;
		for (let t = 0; t <= e.depth; t++) {
			let n = e.node(t);
			this.frontier.push({
				type: n.type,
				match: n.contentMatchAt(e.indexAfter(t))
			});
		}
		for (let t = e.depth; t > 0; t--) this.placed = u.from(e.node(t).copy(this.placed));
	}
	get depth() {
		return this.frontier.length - 1;
	}
	fit() {
		for (; this.unplaced.size;) {
			let e = this.findFittable();
			e ? this.placeNodes(e) : this.openMore() || this.dropNode();
		}
		let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, n = this.$from, r = this.close(e < 0 ? this.$to : n.doc.resolve(e));
		if (!r) return null;
		let i = this.placed, a = n.depth, o = r.depth;
		for (; a && o && i.childCount == 1;) i = i.firstChild.content, a--, o--;
		let s = new p(i, a, o);
		return e > -1 ? new O(n.pos, e, this.$to.pos, this.$to.end(), s, t) : s.size || n.pos != this.$to.pos ? new D(n.pos, r.pos, s) : null;
	}
	findFittable() {
		let e = this.unplaced.openStart;
		for (let t = this.unplaced.content, n = 0, r = this.unplaced.openEnd; n < e; n++) {
			let i = t.firstChild;
			if (t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= n) {
				e = n;
				break;
			}
			t = i.content;
		}
		for (let t = 1; t <= 2; t++) for (let n = t == 1 ? e : this.unplaced.openStart; n >= 0; n--) {
			let e, r = null;
			n ? (r = M(this.unplaced.content, n - 1).firstChild, e = r.content) : e = this.unplaced.content;
			let i = e.firstChild;
			for (let e = this.depth; e >= 0; e--) {
				let { type: a, match: o } = this.frontier[e], s, c = null;
				if (t == 1 && (i ? o.matchType(i.type) || (c = o.fillBefore(u.from(i), !1)) : r && a.compatibleContent(r.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					inject: c
				};
				if (t == 2 && i && (s = o.findWrapping(i.type))) return {
					sliceDepth: n,
					frontierDepth: e,
					parent: r,
					wrap: s
				};
				if (r && o.matchType(r.type)) break;
			}
		}
	}
	openMore() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = M(e, t);
		return !r.childCount || r.firstChild.isLeaf ? !1 : (this.unplaced = new p(e, t + 1, Math.max(n, r.size + t >= e.size - n ? t + 1 : 0)), !0);
	}
	dropNode() {
		let { content: e, openStart: t, openEnd: n } = this.unplaced, r = M(e, t);
		if (r.childCount <= 1 && t > 0) {
			let i = e.size - t <= t + r.size;
			this.unplaced = new p(A(e, t - 1, 1), t - 1, i ? t - 1 : n);
		} else this.unplaced = new p(A(e, t, 1), t, n);
	}
	placeNodes({ sliceDepth: e, frontierDepth: t, parent: n, inject: r, wrap: i }) {
		for (; this.depth > t;) this.closeFrontierNode();
		if (i) for (let e = 0; e < i.length; e++) this.openFrontierNode(i[e]);
		let a = this.unplaced, o = n ? n.content : a.content, s = a.openStart - e, c = 0, l = [], { match: d, type: f } = this.frontier[t];
		if (r) {
			for (let e = 0; e < r.childCount; e++) l.push(r.child(e));
			d = d.matchFragment(r);
		}
		let m = o.size + e - (a.content.size - a.openEnd);
		for (; c < o.childCount;) {
			let e = o.child(c), t = d.matchType(e.type);
			if (!t) break;
			c++, (c > 1 || s == 0 || e.content.size) && (d = t, l.push(Me(e.mark(f.allowedMarks(e.marks)), c == 1 ? s : 0, c == o.childCount ? m : -1)));
		}
		let h = c == o.childCount;
		h || (m = -1), this.placed = j(this.placed, t, u.from(l)), this.frontier[t].match = d, h && m < 0 && n && n.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
		for (let e = 0, t = o; e < m; e++) {
			let e = t.lastChild;
			this.frontier.push({
				type: e.type,
				match: e.contentMatchAt(e.childCount)
			}), t = e.content;
		}
		this.unplaced = h ? e == 0 ? p.empty : new p(A(a.content, e - 1, 1), e - 1, m < 0 ? a.openEnd : e - 1) : new p(A(a.content, e, c), a.openStart, a.openEnd);
	}
	mustMoveInline() {
		if (!this.$to.parent.isTextblock) return -1;
		let e = this.frontier[this.depth], t;
		if (!e.type.isTextblock || !N(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth) return -1;
		let { depth: n } = this.$to, r = this.$to.after(n);
		for (; n > 1 && r == this.$to.end(--n);) ++r;
		return r;
	}
	findCloseLevel(e) {
		scan: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
			let { match: n, type: r } = this.frontier[t], i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), a = N(e, t, r, n, i);
			if (a) {
				for (let n = t - 1; n >= 0; n--) {
					let { match: t, type: r } = this.frontier[n], i = N(e, n, r, t, !0);
					if (!i || i.childCount) continue scan;
				}
				return {
					depth: t,
					fit: a,
					move: i ? e.doc.resolve(e.after(t + 1)) : e
				};
			}
		}
	}
	close(e) {
		let t = this.findCloseLevel(e);
		if (!t) return null;
		for (; this.depth > t.depth;) this.closeFrontierNode();
		t.fit.childCount && (this.placed = j(this.placed, t.depth, t.fit)), e = t.move;
		for (let n = t.depth + 1; n <= e.depth; n++) {
			let t = e.node(n), r = t.type.contentMatch.fillBefore(t.content, !0, e.index(n));
			this.openFrontierNode(t.type, t.attrs, r);
		}
		return e;
	}
	openFrontierNode(e, t = null, n) {
		let r = this.frontier[this.depth];
		r.match = r.match.matchType(e), this.placed = j(this.placed, this.depth, u.from(e.create(t, n))), this.frontier.push({
			type: e,
			match: e.contentMatch
		});
	}
	closeFrontierNode() {
		let e = this.frontier.pop().match.fillBefore(u.empty, !0);
		e.childCount && (this.placed = j(this.placed, this.frontier.length, e));
	}
};
function A(e, t, n) {
	return t == 0 ? e.cutByIndex(n, e.childCount) : e.replaceChild(0, e.firstChild.copy(A(e.firstChild.content, t - 1, n)));
}
function j(e, t, n) {
	return t == 0 ? e.append(n) : e.replaceChild(e.childCount - 1, e.lastChild.copy(j(e.lastChild.content, t - 1, n)));
}
function M(e, t) {
	for (let n = 0; n < t; n++) e = e.firstChild.content;
	return e;
}
function Me(e, t, n) {
	if (t <= 0) return e;
	let r = e.content;
	return t > 1 && (r = r.replaceChild(0, Me(r.firstChild, t - 1, r.childCount == 1 ? n - 1 : 0))), t > 0 && (r = e.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(e.type.contentMatch.matchFragment(r).fillBefore(u.empty, !0)))), e.copy(r);
}
function N(e, t, n, r, i) {
	let a = e.node(t), o = i ? e.indexAfter(t) : e.index(t);
	if (o == a.childCount && !n.compatibleContent(a.type)) return null;
	let s = r.fillBefore(a.content, !0, o);
	return s && !Ne(n, a.content, o) ? s : null;
}
function Ne(e, t, n) {
	for (let r = n; r < t.childCount; r++) if (!e.allowsMarks(t.child(r).marks)) return !0;
	return !1;
}
var Pe = class e extends w {
	constructor(e, t, n) {
		super(), this.pos = e, this.attr = t, this.value = n;
	}
	apply(e) {
		let t = e.nodeAt(this.pos);
		if (!t) return T.fail("No node at attribute step's position");
		let n = Object.create(null);
		for (let e in t.attrs) n[e] = t.attrs[e];
		n[this.attr] = this.value;
		let r = t.type.create(n, null, t.marks);
		return T.fromReplace(e, this.pos, this.pos + 1, new p(u.from(r), 0, t.isLeaf ? 0 : 1));
	}
	getMap() {
		return C.empty;
	}
	invert(t) {
		return new e(this.pos, this.attr, t.nodeAt(this.pos).attrs[this.attr]);
	}
	map(t) {
		let n = t.mapResult(this.pos, 1);
		return n.deletedAfter ? null : new e(n.pos, this.attr, this.value);
	}
	toJSON() {
		return {
			stepType: "attr",
			pos: this.pos,
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number" || typeof n.attr != "string") throw RangeError("Invalid input for AttrStep.fromJSON");
		return new e(n.pos, n.attr, n.value);
	}
};
w.jsonID("attr", Pe);
var Fe = class e extends w {
	constructor(e, t) {
		super(), this.attr = e, this.value = t;
	}
	apply(e) {
		let t = Object.create(null);
		for (let n in e.attrs) t[n] = e.attrs[n];
		t[this.attr] = this.value;
		let n = e.type.create(t, e.content, e.marks);
		return T.ok(n);
	}
	getMap() {
		return C.empty;
	}
	invert(t) {
		return new e(this.attr, t.attrs[this.attr]);
	}
	map(e) {
		return this;
	}
	toJSON() {
		return {
			stepType: "docAttr",
			attr: this.attr,
			value: this.value
		};
	}
	static fromJSON(t, n) {
		if (typeof n.attr != "string") throw RangeError("Invalid input for DocAttrStep.fromJSON");
		return new e(n.attr, n.value);
	}
};
w.jsonID("docAttr", Fe);
var P = class extends Error {};
P = function e(t) {
	let n = Error.call(this, t);
	return n.__proto__ = e.prototype, n;
}, P.prototype = Object.create(Error.prototype), P.prototype.constructor = P, P.prototype.name = "TransformError";
//#endregion
//#region node_modules/prosemirror-commands/dist/index.js
var Ie = (e, t) => e.selection.empty ? !1 : (t && t(e.tr.deleteSelection().scrollIntoView()), !0);
function Le(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("backward", e) : n.parentOffset > 0) ? null : n;
}
var Re = (e, t, r) => {
	let i = Le(e, r);
	if (!i) return !1;
	let o = Be(i);
	if (!o) {
		let n = i.blockRange(), r = n && Te(n);
		return r == null ? !1 : (t && t(e.tr.lift(n, r).scrollIntoView()), !0);
	}
	let s = o.nodeBefore;
	if ($e(e, o, t, -1)) return !0;
	if (i.parent.content.size == 0 && (F(s, "end") || n.isSelectable(s))) for (let r = i.depth;; r--) {
		let c = ke(e.doc, i.before(r), i.after(r), p.empty);
		if (c && c.slice.size < c.to - c.from) {
			if (t) {
				let r = e.tr.step(c);
				r.setSelection(F(s, "end") ? a.findFrom(r.doc.resolve(r.mapping.map(o.pos, -1)), -1) : n.create(r.doc, o.pos - s.nodeSize)), t(r.scrollIntoView());
			}
			return !0;
		}
		if (r == 1 || i.node(r - 1).childCount > 1) break;
	}
	return s.isAtom && o.depth == i.depth - 1 ? (t && t(e.tr.delete(o.pos - s.nodeSize, o.pos).scrollIntoView()), !0) : !1;
};
function F(e, t, n = !1) {
	for (let r = e; r; r = t == "start" ? r.firstChild : r.lastChild) {
		if (r.isTextblock) return !0;
		if (n && r.childCount != 1) return !1;
	}
	return !1;
}
var ze = (e, t, r) => {
	let { $head: i, empty: a } = e.selection, o = i;
	if (!a) return !1;
	if (i.parent.isTextblock) {
		if (r ? !r.endOfTextblock("backward", e) : i.parentOffset > 0) return !1;
		o = Be(i);
	}
	let s = o && o.nodeBefore;
	return !s || !n.isSelectable(s) ? !1 : (t && t(e.tr.setSelection(n.create(e.doc, o.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Be(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		if (e.index(t) > 0) return e.doc.resolve(e.before(t + 1));
		if (e.node(t).type.spec.isolating) break;
	}
	return null;
}
function Ve(e, t) {
	let { $cursor: n } = e.selection;
	return !n || (t ? !t.endOfTextblock("forward", e) : n.parentOffset < n.parent.content.size) ? null : n;
}
var He = (e, t, r) => {
	let i = Ve(e, r);
	if (!i) return !1;
	let o = We(i);
	if (!o) return !1;
	let s = o.nodeAfter;
	if ($e(e, o, t, 1)) return !0;
	if (i.parent.content.size == 0 && (F(s, "start") || n.isSelectable(s))) {
		let r = ke(e.doc, i.before(), i.after(), p.empty);
		if (r && r.slice.size < r.to - r.from) {
			if (t) {
				let i = e.tr.step(r);
				i.setSelection(F(s, "start") ? a.findFrom(i.doc.resolve(i.mapping.map(o.pos)), 1) : n.create(i.doc, i.mapping.map(o.pos))), t(i.scrollIntoView());
			}
			return !0;
		}
	}
	return s.isAtom && o.depth == i.depth - 1 ? (t && t(e.tr.delete(o.pos, o.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, Ue = (e, t, r) => {
	let { $head: i, empty: a } = e.selection, o = i;
	if (!a) return !1;
	if (i.parent.isTextblock) {
		if (r ? !r.endOfTextblock("forward", e) : i.parentOffset < i.parent.content.size) return !1;
		o = We(i);
	}
	let s = o && o.nodeAfter;
	return !s || !n.isSelectable(s) ? !1 : (t && t(e.tr.setSelection(n.create(e.doc, o.pos)).scrollIntoView()), !0);
};
function We(e) {
	if (!e.parent.type.spec.isolating) for (let t = e.depth - 1; t >= 0; t--) {
		let n = e.node(t);
		if (e.index(t) + 1 < n.childCount) return e.doc.resolve(e.after(t + 1));
		if (n.type.spec.isolating) break;
	}
	return null;
}
var Ge = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (t && t(e.tr.insertText("\n").scrollIntoView()), !0);
};
function I(e) {
	for (let t = 0; t < e.edgeCount; t++) {
		let { type: n } = e.edge(t);
		if (n.isTextblock && !n.hasRequiredAttrs()) return n;
	}
	return null;
}
var Ke = (e, t) => {
	let { $head: n, $anchor: r } = e.selection;
	if (!n.parent.type.spec.code || !n.sameParent(r)) return !1;
	let i = n.node(-1), o = n.indexAfter(-1), s = I(i.contentMatchAt(o));
	if (!s || !i.canReplaceWith(o, o, s)) return !1;
	if (t) {
		let r = n.after(), i = e.tr.replaceWith(r, r, s.createAndFill());
		i.setSelection(a.near(i.doc.resolve(r), 1)), t(i.scrollIntoView());
	}
	return !0;
}, qe = (t, n) => {
	let r = t.selection, { $from: i, $to: a } = r;
	if (r instanceof e || i.parent.inlineContent || a.parent.inlineContent) return !1;
	let o = I(a.parent.contentMatchAt(a.indexAfter()));
	if (!o || !o.isTextblock) return !1;
	if (n) {
		let e = (!i.parentOffset && a.index() < a.parent.childCount ? i : a).pos, r = t.tr.insert(e, o.createAndFill());
		r.setSelection(s.create(r.doc, e + 1)), n(r.scrollIntoView());
	}
	return !0;
}, Je = (e, t) => {
	let { $cursor: n } = e.selection;
	if (!n || n.parent.content.size) return !1;
	if (n.depth > 1 && n.after() != n.end(-1)) {
		let r = n.before();
		if (k(e.doc, r)) return t && t(e.tr.split(r).scrollIntoView()), !0;
	}
	let r = n.blockRange(), i = r && Te(r);
	return i == null ? !1 : (t && t(e.tr.lift(r, i).scrollIntoView()), !0);
};
function Ye(t) {
	return (r, i) => {
		let { $from: a, $to: o } = r.selection;
		if (r.selection instanceof n && r.selection.node.isBlock) return !a.parentOffset || !k(r.doc, a.pos) ? !1 : (i && i(r.tr.split(a.pos).scrollIntoView()), !0);
		if (!a.depth) return !1;
		let c = [], l, u, d = !1, f = !1;
		for (let e = a.depth;; e--) if (a.node(e).isBlock) {
			d = a.end(e) == a.pos + (a.depth - e), f = a.start(e) == a.pos - (a.depth - e), u = I(a.node(e - 1).contentMatchAt(a.indexAfter(e - 1)));
			let n = t && t(o.parent, d, a);
			c.unshift(n || (d && u ? { type: u } : null)), l = e;
			break;
		} else {
			if (e == 1) return !1;
			c.unshift(null);
		}
		let p = r.tr;
		(r.selection instanceof s || r.selection instanceof e) && p.deleteSelection();
		let m = p.mapping.map(a.pos), h = k(p.doc, m, c.length, c);
		if (h ||= (c[0] = u ? { type: u } : null, k(p.doc, m, c.length, c)), !h) return !1;
		if (p.split(m, c.length, c), !d && f && a.node(l).type != u) {
			let e = p.mapping.map(a.before(l)), t = p.doc.resolve(e);
			u && a.node(l - 1).canReplaceWith(t.index(), t.index() + 1, u) && p.setNodeMarkup(p.mapping.map(a.before(l)), u);
		}
		return i && i(p.scrollIntoView()), !0;
	};
}
var Xe = Ye(), Ze = (t, n) => (n && n(t.tr.setSelection(new e(t.doc))), !0);
function Qe(e, t, n) {
	let r = t.nodeBefore, i = t.nodeAfter, a = t.index();
	return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && t.parent.canReplace(a - 1, a) ? (n && n(e.tr.delete(t.pos - r.nodeSize, t.pos).scrollIntoView()), !0) : !t.parent.canReplace(a, a + 1) || !(i.isTextblock || Ee(e.doc, t.pos)) ? !1 : (n && n(e.tr.join(t.pos).scrollIntoView()), !0);
}
function $e(e, t, n, r) {
	let i = t.nodeBefore, o = t.nodeAfter, s, c, l = i.type.spec.isolating || o.type.spec.isolating;
	if (!l && Qe(e, t, n)) return !0;
	let d = !l && t.parent.canReplace(t.index(), t.index() + 1);
	if (d && (s = (c = i.contentMatchAt(i.childCount)).findWrapping(o.type)) && c.matchType(s[0] || o.type).validEnd) {
		if (n) {
			let r = t.pos + o.nodeSize, a = u.empty;
			for (let e = s.length - 1; e >= 0; e--) a = u.from(s[e].create(null, a));
			a = u.from(i.copy(a));
			let c = e.tr.step(new O(t.pos - 1, r, t.pos, r, new p(a, 1, 0), s.length, !0)), l = c.doc.resolve(r + 2 * s.length);
			l.nodeAfter && l.nodeAfter.type == i.type && Ee(c.doc, l.pos) && c.join(l.pos), n(c.scrollIntoView());
		}
		return !0;
	}
	let f = o.type.spec.isolating || r > 0 && l ? null : a.findFrom(t, 1), m = f && f.$from.blockRange(f.$to), h = m && Te(m);
	if (h != null && h >= t.depth) return n && n(e.tr.lift(m, h).scrollIntoView()), !0;
	if (d && F(o, "start", !0) && F(i, "end")) {
		let r = i, a = [];
		for (; a.push(r), !r.isTextblock;) r = r.lastChild;
		let s = o, c = 1;
		for (; !s.isTextblock; s = s.firstChild) c++;
		if (r.canReplace(r.childCount, r.childCount, s.content)) {
			if (n) {
				let r = u.empty;
				for (let e = a.length - 1; e >= 0; e--) r = u.from(a[e].copy(r));
				n(e.tr.step(new O(t.pos - a.length, t.pos + o.nodeSize, t.pos + c, t.pos + o.nodeSize - c, new p(r, a.length, 0), 0, !0)).scrollIntoView());
			}
			return !0;
		}
	}
	return !1;
}
function et(e) {
	return function(t, n) {
		let r = t.selection, i = e < 0 ? r.$from : r.$to, a = i.depth;
		for (; i.node(a).isInline;) {
			if (!a) return !1;
			a--;
		}
		return i.node(a).isTextblock ? (n && n(t.tr.setSelection(s.create(t.doc, e < 0 ? i.start(a) : i.end(a)))), !0) : !1;
	};
}
var tt = et(-1), nt = et(1);
function L(e, t = null) {
	return function(n, r) {
		let i = !1;
		for (let r = 0; r < n.selection.ranges.length && !i; r++) {
			let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
			n.doc.nodesBetween(a, o, (r, a) => {
				if (i) return !1;
				if (!(!r.isTextblock || r.hasMarkup(e, t))) if (r.type == e) i = !0;
				else {
					let t = n.doc.resolve(a), r = t.index();
					i = t.parent.canReplaceWith(r, r + 1, e);
				}
			});
		}
		if (!i) return !1;
		if (r) {
			let i = n.tr;
			for (let r = 0; r < n.selection.ranges.length; r++) {
				let { $from: { pos: a }, $to: { pos: o } } = n.selection.ranges[r];
				i.setBlockType(a, o, e, t);
			}
			r(i.scrollIntoView());
		}
		return !0;
	};
}
function rt(e, t, n, r) {
	for (let i = 0; i < t.length; i++) {
		let { $from: a, $to: o } = t[i], s = a.depth == 0 ? e.inlineContent && e.type.allowsMarkType(n) : !1;
		if (e.nodesBetween(a.pos, o.pos, (e, t) => {
			if (s || !r && e.isAtom && e.isInline && t >= a.pos && t + e.nodeSize <= o.pos) return !1;
			s = e.inlineContent && e.type.allowsMarkType(n);
		}), s) return !0;
	}
	return !1;
}
function it(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let { $from: r, $to: i } = e[n];
		r.doc.nodesBetween(r.pos, i.pos, (e, n) => {
			if (e.isAtom && e.content.size && e.isInline && n >= r.pos && n + e.nodeSize <= i.pos) return n + 1 > r.pos && t.push(new o(r, r.doc.resolve(n + 1))), r = r.doc.resolve(n + 1 + e.content.size), !1;
		}), r.pos < i.pos && t.push(new o(r, i));
	}
	return t;
}
function R(e, t = null, n) {
	let r = (n && n.removeWhenPresent) !== !1, i = (n && n.enterInlineAtoms) !== !1, a = !(n && n.includeWhitespace);
	return function(n, o) {
		let { empty: s, $cursor: c, ranges: l } = n.selection;
		if (s && !c || !rt(n.doc, l, e, i)) return !1;
		if (o) if (c) e.isInSet(n.storedMarks || c.marks()) ? o(n.tr.removeStoredMark(e)) : o(n.tr.addStoredMark(e.create(t)));
		else {
			let s, c = n.tr;
			i || (l = it(l)), s = r ? !l.some((t) => n.doc.rangeHasMark(t.$from.pos, t.$to.pos, e)) : !l.every((t) => {
				let n = !1;
				return c.doc.nodesBetween(t.$from.pos, t.$to.pos, (r, i, a) => {
					if (n) return !1;
					n = !e.isInSet(r.marks) && !!a && a.type.allowsMarkType(e) && !(r.isText && /^\s*$/.test(r.textBetween(Math.max(0, t.$from.pos - i), Math.min(r.nodeSize, t.$to.pos - i))));
				}), !n;
			});
			for (let n = 0; n < l.length; n++) {
				let { $from: r, $to: i } = l[n];
				if (!s) c.removeMark(r.pos, i.pos, e);
				else {
					let n = r.pos, o = i.pos, s = r.nodeAfter, l = i.nodeBefore, u = a && s && s.isText ? /^\s*/.exec(s.text)[0].length : 0, d = a && l && l.isText ? /\s*$/.exec(l.text)[0].length : 0;
					n + u < o && (n += u, o -= d), c.addMark(n, o, e.create(t));
				}
			}
			o(c.scrollIntoView());
		}
		return !0;
	};
}
function at(...e) {
	return function(t, n, r) {
		for (let i = 0; i < e.length; i++) if (e[i](t, n, r)) return !0;
		return !1;
	};
}
var ot = at(Ie, Re, ze), st = at(Ie, He, Ue), z = {
	Enter: at(Ge, qe, Je, Xe),
	"Mod-Enter": Ke,
	Backspace: ot,
	"Mod-Backspace": ot,
	"Shift-Backspace": ot,
	Delete: st,
	"Mod-Delete": st,
	"Mod-a": Ze
}, ct = {
	"Ctrl-h": z.Backspace,
	"Alt-Backspace": z["Mod-Backspace"],
	"Ctrl-d": z.Delete,
	"Ctrl-Alt-Backspace": z["Mod-Delete"],
	"Alt-Delete": z["Mod-Delete"],
	"Alt-d": z["Mod-Delete"],
	"Ctrl-a": tt,
	"Ctrl-e": nt
};
for (let e in z) ct[e] = z[e];
var lt = (typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin") ? ct : z, B = 200, V = function() {};
V.prototype.append = function(e) {
	return e.length ? (e = V.from(e), !this.length && e || e.length < B && this.leafAppend(e) || this.length < B && e.leafPrepend(this) || this.appendInner(e)) : this;
}, V.prototype.prepend = function(e) {
	return e.length ? V.from(e).append(this) : this;
}, V.prototype.appendInner = function(e) {
	return new dt(this, e);
}, V.prototype.slice = function(e, t) {
	return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? V.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
}, V.prototype.get = function(e) {
	if (!(e < 0 || e >= this.length)) return this.getInner(e);
}, V.prototype.forEach = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length), t <= n ? this.forEachInner(e, t, n, 0) : this.forEachInvertedInner(e, t, n, 0);
}, V.prototype.map = function(e, t, n) {
	t === void 0 && (t = 0), n === void 0 && (n = this.length);
	var r = [];
	return this.forEach(function(t, n) {
		return r.push(e(t, n));
	}, t, n), r;
}, V.from = function(e) {
	return e instanceof V ? e : e && e.length ? new ut(e) : V.empty;
};
var ut = /* @__PURE__ */ function(e) {
	function t(t) {
		e.call(this), this.values = t;
	}
	e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
	var n = {
		length: { configurable: !0 },
		depth: { configurable: !0 }
	};
	return t.prototype.flatten = function() {
		return this.values;
	}, t.prototype.sliceInner = function(e, n) {
		return e == 0 && n == this.length ? this : new t(this.values.slice(e, n));
	}, t.prototype.getInner = function(e) {
		return this.values[e];
	}, t.prototype.forEachInner = function(e, t, n, r) {
		for (var i = t; i < n; i++) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		for (var i = t - 1; i >= n; i--) if (e(this.values[i], r + i) === !1) return !1;
	}, t.prototype.leafAppend = function(e) {
		if (this.length + e.length <= B) return new t(this.values.concat(e.flatten()));
	}, t.prototype.leafPrepend = function(e) {
		if (this.length + e.length <= B) return new t(e.flatten().concat(this.values));
	}, n.length.get = function() {
		return this.values.length;
	}, n.depth.get = function() {
		return 0;
	}, Object.defineProperties(t.prototype, n), t;
}(V);
V.empty = new ut([]);
var dt = /* @__PURE__ */ function(e) {
	function t(t, n) {
		e.call(this), this.left = t, this.right = n, this.length = t.length + n.length, this.depth = Math.max(t.depth, n.depth) + 1;
	}
	return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.flatten = function() {
		return this.left.flatten().concat(this.right.flatten());
	}, t.prototype.getInner = function(e) {
		return e < this.left.length ? this.left.get(e) : this.right.get(e - this.left.length);
	}, t.prototype.forEachInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t < i && this.left.forEachInner(e, t, Math.min(n, i), r) === !1 || n > i && this.right.forEachInner(e, Math.max(t - i, 0), Math.min(this.length, n) - i, r + i) === !1) return !1;
	}, t.prototype.forEachInvertedInner = function(e, t, n, r) {
		var i = this.left.length;
		if (t > i && this.right.forEachInvertedInner(e, t - i, Math.max(n, i) - i, r + i) === !1 || n < i && this.left.forEachInvertedInner(e, Math.min(t, i), n, r) === !1) return !1;
	}, t.prototype.sliceInner = function(e, t) {
		if (e == 0 && t == this.length) return this;
		var n = this.left.length;
		return t <= n ? this.left.slice(e, t) : e >= n ? this.right.slice(e - n, t - n) : this.left.slice(e, n).append(this.right.slice(0, t - n));
	}, t.prototype.leafAppend = function(e) {
		var n = this.right.leafAppend(e);
		if (n) return new t(this.left, n);
	}, t.prototype.leafPrepend = function(e) {
		var n = this.left.leafPrepend(e);
		if (n) return new t(n, this.right);
	}, t.prototype.appendInner = function(e) {
		return this.left.depth >= Math.max(this.right.depth, e.depth) + 1 ? new t(this.left, new t(this.right, e)) : new t(this, e);
	}, t;
}(V), ft = 500, H = class e {
	constructor(e, t) {
		this.items = e, this.eventCount = t;
	}
	popEvent(t, n) {
		if (this.eventCount == 0) return null;
		let r = this.items.length;
		for (;; r--) if (this.items.get(r - 1).selection) {
			--r;
			break;
		}
		let i, a;
		n && (i = this.remapping(r, this.items.length), a = i.maps.length);
		let o = t.tr, s, c, l = [], u = [];
		return this.items.forEach((t, n) => {
			if (!t.step) {
				i || (i = this.remapping(r, n + 1), a = i.maps.length), a--, u.push(t);
				return;
			}
			if (i) {
				u.push(new U(t.map));
				let e = t.step.map(i.slice(a)), n;
				e && o.maybeStep(e).doc && (n = o.mapping.maps[o.mapping.maps.length - 1], l.push(new U(n, void 0, void 0, l.length + u.length))), a--, n && i.appendMap(n, a);
			} else o.maybeStep(t.step);
			if (t.selection) return s = i ? t.selection.map(i.slice(a)) : t.selection, c = new e(this.items.slice(0, r).append(u.reverse().concat(l)), this.eventCount - 1), !1;
		}, this.items.length, 0), {
			remaining: c,
			transform: o,
			selection: s
		};
	}
	addTransform(t, n, r, i) {
		let a = [], o = this.eventCount, s = this.items, c = !i && s.length ? s.get(s.length - 1) : null;
		for (let e = 0; e < t.steps.length; e++) {
			let r = t.steps[e].invert(t.docs[e]), l = new U(t.mapping.maps[e], r, n), u;
			(u = c && c.merge(l)) && (l = u, e ? a.pop() : s = s.slice(0, s.length - 1)), a.push(l), n &&= (o++, void 0), i || (c = l);
		}
		let l = o - r.depth;
		return l > mt && (s = pt(s, l), o -= l), new e(s.append(a), o);
	}
	remapping(e, t) {
		let n = new _e();
		return this.items.forEach((t, r) => {
			let i = t.mirrorOffset != null && r - t.mirrorOffset >= e ? n.maps.length - t.mirrorOffset : void 0;
			n.appendMap(t.map, i);
		}, e, t), n;
	}
	addMaps(t) {
		return this.eventCount == 0 ? this : new e(this.items.append(t.map((e) => new U(e))), this.eventCount);
	}
	rebased(t, n) {
		if (!this.eventCount) return this;
		let r = [], i = Math.max(0, this.items.length - n), a = t.mapping, o = t.steps.length, s = this.eventCount;
		this.items.forEach((e) => {
			e.selection && s--;
		}, i);
		let c = n;
		this.items.forEach((e) => {
			let n = a.getMirror(--c);
			if (n == null) return;
			o = Math.min(o, n);
			let i = a.maps[n];
			if (e.step) {
				let o = t.steps[n].invert(t.docs[n]), l = e.selection && e.selection.map(a.slice(c + 1, n));
				l && s++, r.push(new U(i, o, l));
			} else r.push(new U(i));
		}, i);
		let l = [];
		for (let e = n; e < o; e++) l.push(new U(a.maps[e]));
		let u = new e(this.items.slice(0, i).append(l).append(r), s);
		return u.emptyItemCount() > ft && (u = u.compress(this.items.length - r.length)), u;
	}
	emptyItemCount() {
		let e = 0;
		return this.items.forEach((t) => {
			t.step || e++;
		}), e;
	}
	compress(t = this.items.length) {
		let n = this.remapping(0, t), r = n.maps.length, i = [], a = 0;
		return this.items.forEach((e, o) => {
			if (o >= t) i.push(e), e.selection && a++;
			else if (e.step) {
				let t = e.step.map(n.slice(r)), o = t && t.getMap();
				if (r--, o && n.appendMap(o, r), t) {
					let s = e.selection && e.selection.map(n.slice(r));
					s && a++;
					let c = new U(o.invert(), t, s), l, u = i.length - 1;
					(l = i.length && i[u].merge(c)) ? i[u] = l : i.push(c);
				}
			} else e.map && r--;
		}, this.items.length, 0), new e(V.from(i.reverse()), a);
	}
};
H.empty = new H(V.empty, 0);
function pt(e, t) {
	let n;
	return e.forEach((e, r) => {
		if (e.selection && t-- == 0) return n = r, !1;
	}), e.slice(n);
}
var U = class e {
	constructor(e, t, n, r) {
		this.map = e, this.step = t, this.selection = n, this.mirrorOffset = r;
	}
	merge(t) {
		if (this.step && t.step && !t.selection) {
			let n = t.step.merge(this.step);
			if (n) return new e(n.getMap().invert(), n, this.selection);
		}
	}
}, W = class {
	constructor(e, t, n, r, i) {
		this.done = e, this.undone = t, this.prevRanges = n, this.prevTime = r, this.prevComposition = i;
	}
}, mt = 20;
function ht(e, t, n, r) {
	let i = n.getMeta(J), a;
	if (i) return i.historyState;
	n.getMeta(bt) && (e = new W(e.done, e.undone, null, 0, -1));
	let o = n.getMeta("appendedTransaction");
	if (n.steps.length == 0) return e;
	if (o && o.getMeta(J)) return o.getMeta(J).redo ? new W(e.done.addTransform(n, void 0, r, q(t)), e.undone, _t(n.mapping.maps), e.prevTime, e.prevComposition) : new W(e.done, e.undone.addTransform(n, void 0, r, q(t)), null, e.prevTime, e.prevComposition);
	if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
		let i = n.getMeta("composition"), a = e.prevTime == 0 || !o && e.prevComposition != i && (e.prevTime < (n.time || 0) - r.newGroupDelay || !gt(n, e.prevRanges)), s = o ? G(e.prevRanges, n.mapping) : _t(n.mapping.maps);
		return new W(e.done.addTransform(n, a ? t.selection.getBookmark() : void 0, r, q(t)), H.empty, s, n.time, i ?? e.prevComposition);
	} else if (a = n.getMeta("rebased")) return new W(e.done.rebased(n, a), e.undone.rebased(n, a), G(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
	else return new W(e.done.addMaps(n.mapping.maps), e.undone.addMaps(n.mapping.maps), G(e.prevRanges, n.mapping), e.prevTime, e.prevComposition);
}
function gt(e, t) {
	if (!t) return !1;
	if (!e.docChanged) return !0;
	let n = !1;
	return e.mapping.maps[0].forEach((e, r) => {
		for (let i = 0; i < t.length; i += 2) e <= t[i + 1] && r >= t[i] && (n = !0);
	}), n;
}
function _t(e) {
	let t = [];
	for (let n = e.length - 1; n >= 0 && t.length == 0; n--) e[n].forEach((e, n, r, i) => t.push(r, i));
	return t;
}
function G(e, t) {
	if (!e) return null;
	let n = [];
	for (let r = 0; r < e.length; r += 2) {
		let i = t.map(e[r], 1), a = t.map(e[r + 1], -1);
		i <= a && n.push(i, a);
	}
	return n;
}
function vt(e, t, n) {
	let r = q(t), i = J.get(t).spec.config, a = (n ? e.undone : e.done).popEvent(t, r);
	if (!a) return null;
	let o = a.selection.resolve(a.transform.doc), s = (n ? e.done : e.undone).addTransform(a.transform, t.selection.getBookmark(), i, r), c = new W(n ? s : a.remaining, n ? a.remaining : s, null, 0, -1);
	return a.transform.setSelection(o).setMeta(J, {
		redo: n,
		historyState: c
	});
}
var K = !1, yt = null;
function q(e) {
	let t = e.plugins;
	if (yt != t) {
		K = !1, yt = t;
		for (let e = 0; e < t.length; e++) if (t[e].spec.historyPreserveItems) {
			K = !0;
			break;
		}
	}
	return K;
}
var J = new i("history"), bt = new i("closeHistory");
function xt(e = {}) {
	return e = {
		depth: e.depth || 100,
		newGroupDelay: e.newGroupDelay || 500
	}, new r({
		key: J,
		state: {
			init() {
				return new W(H.empty, H.empty, null, 0, -1);
			},
			apply(t, n, r) {
				return ht(n, r, t, e);
			}
		},
		config: e,
		props: { handleDOMEvents: { beforeinput(e, t) {
			let n = t.inputType, r = n == "historyUndo" ? Ct : n == "historyRedo" ? Y : null;
			return !r || !e.editable ? !1 : (t.preventDefault(), r(e.state, e.dispatch));
		} } }
	});
}
function St(e, t) {
	return (n, r) => {
		let i = J.getState(n);
		if (!i || (e ? i.undone : i.done).eventCount == 0) return !1;
		if (r) {
			let a = vt(i, n, e);
			a && r(t ? a.scrollIntoView() : a);
		}
		return !0;
	};
}
var Ct = St(!1, !0), Y = St(!0, !0), wt = () => {
	if (document.getElementById("kateb-editor-styles")) return;
	let e = document.createElement("style");
	e.id = "kateb-editor-styles", e.appendChild(document.createTextNode("\n    .kateb-editor-container {\n      direction: rtl;\n      border: 1px solid #ddd;\n      padding: 20px;\n      min-height: 200px;\n      border-radius: 8px;\n      font-family: 'Noto Naskh Arabic', 'Amiri', 'Scheherazade', 'Lateef', 'Segoe UI', 'Tahoma', 'Roboto', 'Helvetica Neue', sans-serif;\n      line-height: 1.6;\n      outline: none;\n      background: white;\n    }\n\n    .kateb-editor-container [dir=\"rtl\"]:empty::before {\n      content: '';\n      display: inline-block;\n      width: 0;\n    }\n\n    .kateb-editor-container p,\n    .kateb-editor-container h1,\n    .kateb-editor-container h2,\n    .kateb-editor-container h3 {\n      // unicode-bidi: plaintext;\n    }\n    .kateb-editor-container p {\n      margin: 0 0 1em;\n    }\n    .kateb-editor-container:focus {\n      border-color: #007bff;\n      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);\n    }\n  ")), document.head.appendChild(e);
}, Tt = {
	",": "،",
	"?": "؟",
	";": "؛"
}, Et = new r({ props: { handleTextInput(e, t, n, r) {
	let i = Tt[r];
	if (i) {
		let r = e.state.tr.insertText(i, t, n);
		return e.dispatch(r), !0;
	}
	return !1;
} } }), Dt = new r({ view(e) {
	return e.dom.setAttribute("dir", "rtl"), { update(e) {
		e.dom.getAttribute("dir") !== "rtl" && e.dom.setAttribute("dir", "rtl");
	} };
} });
//#endregion
//#region src/engine-arabic/direction-detector.ts
function Ot(e) {
	if (!e) return "rtl";
	let t = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
	for (let n of e) if (!(/\s/.test(n) || /[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(n) || /[0-9]/.test(n))) return t.test(n) ? "rtl" : "ltr";
	return "rtl";
}
var kt = new r({
	key: new i("auto-direction"),
	appendTransaction(e, t, n) {
		if (!e.some((e) => e.docChanged)) return null;
		let { $from: r } = n.selection, i = r.node(r.depth);
		if (!i || !i.attrs || !("dir" in i.attrs)) return null;
		let a = i.textContent, o = Ot(a);
		if (o !== (i.attrs.dir || "rtl")) {
			let e = n.tr, t = r.before(r.depth);
			return e.setNodeAttribute(t, "dir", o), e;
		}
		return null;
	}
}), At = new Set([
	"p",
	"h1",
	"h2",
	"h3"
]), jt = new Set([
	"strong",
	"b",
	"em",
	"i",
	"br"
]);
function Mt(e) {
	let t = new globalThis.DOMParser().parseFromString(e, "text/html"), n = t.body, r = (e) => {
		if (e.nodeType === Node.TEXT_NODE) return e.cloneNode(!0);
		if (e.nodeType !== Node.ELEMENT_NODE) return null;
		let n = e, i = n.tagName.toLowerCase();
		if (At.has(i)) {
			let e = t.createElement(i), a = n.getAttribute("dir");
			a && e.setAttribute("dir", a);
			for (let t of Array.from(n.childNodes)) {
				let n = r(t);
				n && e.appendChild(n);
			}
			return e;
		}
		if (jt.has(i)) {
			let e = i;
			i === "b" && (e = "strong"), i === "i" && (e = "em");
			let a = t.createElement(e), o = n.getAttribute("dir");
			o && a.setAttribute("dir", o);
			for (let e of Array.from(n.childNodes)) {
				let t = r(e);
				t && a.appendChild(t);
			}
			return a;
		}
		let a = t.createDocumentFragment();
		for (let e of Array.from(n.childNodes)) {
			let t = r(e);
			t && a.appendChild(t);
		}
		return a;
	}, i = t.createElement("body");
	for (let e of Array.from(n.childNodes)) {
		let t = r(e);
		t && i.appendChild(t);
	}
	let a = t.createElement("div");
	return a.appendChild(i), a.innerHTML;
}
var Nt = new r({ props: { handlePaste(e, t) {
	let n = t.clipboardData;
	if (!n) return !1;
	let r = n.getData("text/html");
	if (!r) return !1;
	let i = Mt(r);
	if (!i) return !1;
	let a = l.fromSchema(e.state.schema), o = new globalThis.DOMParser().parseFromString(i, "text/html"), s = a.parse(o.body), c = e.state.tr.replaceSelectionWith(s, !1);
	return e.dispatch(c), !0;
} } }), X = class {
	constructor(e, t, n = {}) {
		this.match = e, this.match = e, this.handler = typeof t == "string" ? Pt(t) : t, this.undoable = n.undoable !== !1, this.inCode = n.inCode || !1, this.inCodeMark = n.inCodeMark !== !1;
	}
};
function Pt(e) {
	return function(t, n, r, i) {
		let a = e;
		if (n[1]) {
			let e = n[0].lastIndexOf(n[1]);
			a += n[0].slice(e + n[1].length), r += e;
			let t = r - i;
			t > 0 && (a = n[0].slice(e - t, e) + a, r = i);
		}
		return t.tr.insertText(a, r, i);
	};
}
var Ft = 500;
function It({ rules: e }) {
	let t = new r({
		state: {
			init() {
				return null;
			},
			apply(e, t) {
				return e.getMeta(this) || (e.selectionSet || e.docChanged ? null : t);
			}
		},
		props: {
			handleTextInput(n, r, i, a) {
				return Lt(n, r, i, a, e, t);
			},
			handleDOMEvents: { compositionend: (n) => {
				setTimeout(() => {
					let { $cursor: r } = n.state.selection;
					r && Lt(n, r.pos, r.pos, "", e, t);
				});
			} }
		},
		isInputRules: !0
	});
	return t;
}
function Lt(e, t, n, r, i, a) {
	if (e.composing) return !1;
	let o = e.state, s = o.doc.resolve(t), c = s.parent.textBetween(Math.max(0, s.parentOffset - Ft), s.parentOffset, null, "￼") + r;
	for (let l = 0; l < i.length; l++) {
		let u = i[l];
		if (!u.inCodeMark && s.marks().some((e) => e.type.spec.code)) continue;
		if (s.parent.type.spec.code) {
			if (!u.inCode) continue;
		} else if (u.inCode === "only") continue;
		let d = u.match.exec(c);
		if (!d || d[0].length < r.length) continue;
		let f = t - (d[0].length - r.length);
		if (!u.inCodeMark) {
			let e = !1;
			if (o.doc.nodesBetween(f, s.pos, (t) => {
				t.isInline && t.marks.some((e) => e.type.spec.code) && (e = !0);
			}), e) continue;
		}
		let p = u.handler(o, d, f, n);
		if (p) return u.undoable && p.setMeta(a, {
			transform: p,
			from: t,
			to: n,
			text: r
		}), e.dispatch(p), !0;
	}
	return !1;
}
new X(/--$/, "—", { inCodeMark: !1 }), new X(/\.\.\.$/, "…", { inCodeMark: !1 }), new X(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“", { inCodeMark: !1 }), new X(/"$/, "”", { inCodeMark: !1 }), new X(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘", { inCodeMark: !1 }), new X(/'$/, "’", { inCodeMark: !1 });
//#endregion
//#region src/engine-arabic/markdown-inputrules.ts
function Rt(e) {
	return new X(RegExp(`^(#{${e}})\\s$`), (t, n, r, i) => {
		let o = t.schema.nodes.heading.create({
			level: e,
			dir: "rtl"
		}), s = t.tr.replaceRangeWith(r, i, o), c = r + 1;
		return s.setSelection(a.near(s.doc.resolve(c)));
	});
}
var zt = It({ rules: [
	Rt(1),
	Rt(2),
	Rt(3)
] }), Bt = () => {
	if (document.getElementById("kateb-toolbar-styles")) return;
	let e = document.createElement("style");
	e.id = "kateb-toolbar-styles", e.appendChild(document.createTextNode("\n  .kateb-toolbar {\n      position: fixed;\n      z-index: 1000;\n      background: #fff;\n      border: 1px solid #ddd;\n      border-radius: 6px;\n      box-shadow: 0 2px 6px rgba(0,0,0,0.1);\n      padding: 4px 8px;\n      display: none;\n      gap: 4px;\n      font-family: inherit;\n      white-space: nowrap;\n    }\n    .kateb-toolbar button {\n      background: transparent;\n      border: none;\n      border-radius: 4px;\n      cursor: pointer;\n      font-size: 14px;\n      padding: 4px 8px;\n      transition: background 0.2s;\n    }\n    .kateb-toolbar button:hover {\n      background: #f0f0f0;\n    }\n    .kateb-toolbar button.active {\n      background: #e0e0e0;\n    }\n  ")), document.head.appendChild(e);
}, Vt = class {
	constructor(e, t, n) {
		this.toolbarElement = null, this.buttons = [], this.isVisible = !1, this.clickOutsideHandler = null, this.blurHandler = null, this.view = e, this.editorDom = e.dom, this.blocks = t, this.marks = n, Bt(), this.createToolbar(), this.attachEventListeners(), this.hide();
	}
	createToolbar() {
		this.toolbarElement = document.createElement("div"), this.toolbarElement.className = "kateb-toolbar";
		let e = [];
		for (let t of this.blocks) t.toolbarButtons && e.push(...t.toolbarButtons);
		for (let t of this.marks) t.toolbarButtons && e.push(...t.toolbarButtons);
		for (let t of e) {
			let e = document.createElement("button");
			e.textContent = t.label, e.addEventListener("mousedown", (e) => {
				e.preventDefault(), t.command(this.view.state, this.view.dispatch), this.view.focus();
			}), this.toolbarElement.appendChild(e), this.buttons.push({
				element: e,
				command: t.command,
				isActive: t.isActive
			});
		}
		document.body.appendChild(this.toolbarElement);
	}
	positionToolbar() {
		if (!this.toolbarElement) return;
		let { state: e } = this.view, { from: t, to: n } = e.selection;
		if (t === n) return;
		let r = this.view.coordsAtPos(t), i = this.view.coordsAtPos(n), a = r.left + (i.right - r.left) / 2, o = r.top - 40;
		this.toolbarElement.style.top = `${o}px`, this.toolbarElement.style.left = `${a - 50}px`;
	}
	updateActiveStates() {
		let { state: e } = this.view;
		for (let t of this.buttons) t.isActive && (t.isActive(e) ? t.element.classList.add("active") : t.element.classList.remove("active"));
	}
	show() {
		if (!this.toolbarElement) return;
		let { state: e } = this.view, { from: t, to: n, $from: r, $to: i } = e.selection;
		if (t === n) {
			this.isVisible && this.hide();
			return;
		}
		if (r.depth === 0 || i.depth === 0) {
			this.isVisible && this.hide();
			return;
		}
		if (r.before(r.depth) !== i.before(i.depth)) {
			this.isVisible && this.hide();
			return;
		}
		this.positionToolbar(), this.toolbarElement.style.display = "flex", this.isVisible = !0, this.updateActiveStates();
	}
	hide() {
		this.toolbarElement && this.isVisible && (this.toolbarElement.style.display = "none", this.isVisible = !1);
	}
	attachEventListeners() {
		let e = null, t = null, n = () => {
			e && cancelAnimationFrame(e), e = requestAnimationFrame(() => {
				this.show(), e = null;
			});
		};
		this.editorDom.addEventListener("mouseup", () => {
			t &&= (clearTimeout(t), null), n();
		}), document.addEventListener("selectionchange", () => {
			t && clearTimeout(t), t = window.setTimeout(() => {
				n(), t = null;
			}, 200);
		}), this.clickOutsideHandler = (e) => {
			let t = e.target;
			!this.editorDom.contains(t) && !this.toolbarElement?.contains(t) && this.hide();
		}, document.addEventListener("click", this.clickOutsideHandler), this.blurHandler = () => {
			this.hide();
		}, this.editorDom.addEventListener("blur", this.blurHandler);
	}
	destroy() {
		this.clickOutsideHandler &&= (document.removeEventListener("click", this.clickOutsideHandler), null), this.blurHandler &&= (this.editorDom.removeEventListener("blur", this.blurHandler), null), this.toolbarElement &&= (this.toolbarElement.remove(), null);
	}
}, Ht = () => {
	if (document.getElementById("kateb-slash-menu-styles")) return;
	let e = document.createElement("style");
	e.id = "kateb-slash-menu-styles", e.appendChild(document.createTextNode("\n    .kateb-slash-menu {\n      position: fixed;\n      z-index: 1000;\n      background: #fff;\n      border: 1px solid #ddd;\n      border-radius: 6px;\n      box-shadow: 0 2px 6px rgba(0,0,0,0.1);\n      min-width: 180px;\n      max-height: 200px;\n      overflow-y: auto;\n      font-family: inherit;\n      direction: rtl; \n      text-align: right;\n    }\n    .kateb-slash-menu-item {\n      padding: 6px 12px;\n      cursor: pointer;\n      transition: background 0.2s;\n      white-space: nowrap;\n    }\n    .kateb-slash-menu-item:hover,\n    .kateb-slash-menu-item.selected {\n      background: #f0f0f0;\n    }\n  ")), document.head.appendChild(e);
}, Ut = class {
	constructor(e, t) {
		this.menu = null, this.isVisible = !1, this.selectedIndex = 0, this.keydownHandler = null, this.slashPos = 0, this.view = e, this.blocks = t.filter((e) => e.slashMenuItem), this.filteredBlocks = [...this.blocks], Ht(), this.createMenu(), this.hide(), this.attachGlobalEvents();
	}
	createMenu() {
		this.menu = document.createElement("div"), this.menu.className = "kateb-slash-menu", document.body.appendChild(this.menu);
	}
	renderMenu() {
		if (this.menu) {
			if (this.menu.innerHTML = "", this.filteredBlocks.length === 0) {
				let e = document.createElement("div");
				e.className = "kateb-slash-menu-empty", e.textContent = "لا توجد نتائج", e.style.padding = "6px 12px", e.style.color = "#888", this.menu.appendChild(e);
				return;
			}
			this.filteredBlocks.forEach((e, t) => {
				let n = document.createElement("div");
				n.className = "kateb-slash-menu-item", t === this.selectedIndex && n.classList.add("selected"), n.textContent = e.slashMenuItem.label, n.addEventListener("click", () => this.selectBlock(e)), this.menu.appendChild(n);
			});
		}
	}
	selectBlock(e) {
		let { state: t } = this.view, n = t.selection.from, r = t.tr.delete(this.slashPos, n), i = t.schema.nodes[e.name];
		if (!i) return;
		let o = i.create({ dir: "rtl" });
		r.replaceRangeWith(this.slashPos, this.slashPos, o);
		let s = this.slashPos + 1;
		r.setSelection(a.near(r.doc.resolve(s))), this.view.dispatch(r), this.hide();
	}
	show(e) {
		if (!this.menu) return;
		this.slashPos = e, this.filteredBlocks = [...this.blocks], this.selectedIndex = 0;
		let t = this.view.coordsAtPos(e);
		this.menu.style.top = `${t.bottom + 5}px`, this.menu.style.left = `${t.left - 190}px`, this.menu.style.display = "block", this.isVisible = !0, this.renderMenu();
	}
	hide() {
		this.menu && (this.menu.style.display = "none", this.isVisible = !1);
	}
	isSlashStillPresent() {
		if (!this.menu) return !1;
		try {
			return this.view.state.doc.textBetween(this.slashPos, this.slashPos + 1) === "/";
		} catch {
			return !1;
		}
	}
	updateFilter() {
		if (!this.isVisible) return;
		if (!this.isSlashStillPresent()) {
			this.hide();
			return;
		}
		let { state: e } = this.view, t = this.slashPos + 1, n = e.selection.from, r = e.doc.textBetween(t, n).toLowerCase().trim();
		this.filteredBlocks = this.blocks.filter((e) => {
			let t = e.slashMenuItem;
			return !!(t.label.toLowerCase().includes(r) || t.searchTerms && t.searchTerms.some((e) => e.toLowerCase().includes(r)));
		}), this.selectedIndex = 0, this.renderMenu();
	}
	navigate(e) {
		!this.isVisible || this.filteredBlocks.length === 0 || (e === "up" ? this.selectedIndex = (this.selectedIndex - 1 + this.filteredBlocks.length) % this.filteredBlocks.length : this.selectedIndex = (this.selectedIndex + 1) % this.filteredBlocks.length, this.renderMenu());
	}
	selectCurrent() {
		if (!this.isVisible || this.filteredBlocks.length === 0) return;
		let e = this.filteredBlocks[this.selectedIndex];
		e && this.selectBlock(e);
	}
	attachGlobalEvents() {
		let e = null;
		this.keydownHandler = (t) => {
			if (this.isVisible) {
				if (t.key === "ArrowUp") {
					t.preventDefault(), this.navigate("up");
					return;
				}
				if (t.key === "ArrowDown") {
					t.preventDefault(), this.navigate("down");
					return;
				}
				if (t.key === "Enter") {
					t.preventDefault(), this.selectCurrent();
					return;
				}
				if (t.key === "Escape") {
					t.preventDefault(), this.hide();
					return;
				}
				if (t.key === "Backspace" || t.key === "Delete") {
					e && cancelAnimationFrame(e), e = requestAnimationFrame(() => {
						this.updateFilter(), e = null;
					});
					return;
				}
			}
		}, document.addEventListener("keydown", this.keydownHandler);
	}
	destroy() {
		this.keydownHandler &&= (document.removeEventListener("keydown", this.keydownHandler), null), this.menu &&= (this.menu.remove(), null);
	}
}, Wt = (e, t) => {
	let n = e.schema.nodes.hard_break?.create();
	return n ? (t && t(e.tr.replaceSelectionWith(n).scrollIntoView()), !0) : !1;
}, Gt = (e, t, n) => {
	let r = {
		"Shift-Enter": Wt,
		"Mod-Enter": Wt,
		"Mod-z": Ct,
		"Mod-y": Y,
		"Mod-Shift-z": Y
	};
	for (let t of e) t.keymap && Object.assign(r, t.keymap);
	for (let e of t) e.keymap && Object.assign(r, e.keymap);
	return se(r);
}, Kt = {
	doc: { content: "block+" },
	text: { group: "inline" },
	hard_break: {
		inline: !0,
		group: "inline",
		selectable: !1,
		parseDOM: [{ tag: "br" }],
		toDOM() {
			return ["br"];
		}
	}
}, qt = {}, Jt = class e {
	constructor() {
		this.nodes = /* @__PURE__ */ new Map(), this.marks = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(Kt)) this.nodes.set(e, t);
		for (let [e, t] of Object.entries(qt)) this.marks.set(e, t);
	}
	addBlock(e) {
		if (this.nodes.has(e.name)) throw Error(`Duplicate block name: "${e.name}"`);
		return this.nodes.set(e.name, e.spec), this;
	}
	addMark(e) {
		if (this.marks.has(e.name)) throw Error(`Duplicate mark name: "${e.name}"`);
		return this.marks.set(e.name, e.spec), this;
	}
	validate() {
		for (let [e, t] of this.nodes) if (!Kt[e] && (!t || typeof t != "object")) throw Error(`Block "${e}" has an invalid spec: ${t}`);
	}
	build() {
		this.validate();
		let e = {};
		for (let [t, n] of this.nodes) e[t] = n;
		let t = {};
		for (let [e, n] of this.marks) t[e] = n;
		return new f({
			nodes: e,
			marks: t
		});
	}
	static build(t, n) {
		let r = new e();
		for (let e of t) r.addBlock(e);
		for (let e of n) r.addMark(e);
		return r.build();
	}
}, Z = class {
	constructor(e) {
		this.name = e.name, this.spec = e.spec, this.slashMenuItem = e.slashMenuItem, this.allowedMarks = e.allowedMarks, this.toolbarButtons = e.toolbarButtons, this.keymap = e.keymap;
	}
}, Yt = (e) => {
	let { $from: t } = e.selection;
	return t.node(t.depth)?.attrs?.dir || "rtl";
}, Xt = new Z({
	name: "paragraph",
	spec: {
		attrs: { dir: { default: "rtl" } },
		content: "inline*",
		group: "block",
		parseDOM: [{
			tag: "p",
			getAttrs: (e) => typeof e == "string" ? { dir: "rtl" } : { dir: e.getAttribute("dir") || "rtl" }
		}],
		toDOM(e) {
			return [
				"p",
				{ dir: e.attrs.dir },
				0
			];
		}
	},
	slashMenuItem: {
		label: "فقرة (Paragraph)",
		searchTerms: [
			"paragraph",
			"para",
			"p",
			"فقرة",
			"ف"
		]
	},
	allowedMarks: ["strong", "em"],
	toolbarButtons: [{
		label: "P",
		command: (e, t) => {
			let n = Yt(e);
			return L(e.schema.nodes.paragraph, { dir: n })(e, t);
		},
		isActive: (e) => {
			let { $from: t } = e.selection;
			return t.node(t.depth)?.type.name === "paragraph";
		}
	}],
	keymap: { "Mod-Alt-p": (e, t) => {
		let n = Yt(e);
		return L(e.schema.nodes.paragraph, { dir: n })(e, t);
	} }
}), Q = class {
	constructor(e) {
		this.name = e.name, this.spec = e.spec, this.toolbarButtons = e.toolbarButtons, this.keymap = e.keymap;
	}
}, Zt = new Q({
	name: "strong",
	spec: {
		parseDOM: [{ tag: "strong" }, {
			tag: "b",
			getAttrs: () => null
		}],
		toDOM() {
			return ["strong", 0];
		}
	},
	toolbarButtons: [{
		label: "B",
		command: (e, t) => {
			let n = e.schema.marks.strong;
			return n ? R(n)(e, t) : !1;
		},
		isActive: (e) => {
			let { from: t, to: n } = e.selection;
			return e.doc.rangeHasMark(t, n, e.schema.marks.strong);
		}
	}],
	keymap: { "Mod-b": (e, t) => {
		let n = e.schema.marks.strong;
		return n ? R(n)(e, t) : !1;
	} }
}), Qt = new Q({
	name: "em",
	spec: {
		parseDOM: [{ tag: "em" }, {
			tag: "i",
			getAttrs: () => null
		}],
		toDOM() {
			return ["em", 0];
		}
	},
	toolbarButtons: [{
		label: "I",
		command: (e, t) => {
			let n = e.schema.marks.em;
			return n ? R(n)(e, t) : !1;
		},
		isActive: (e) => {
			let { from: t, to: n } = e.selection;
			return e.doc.rangeHasMark(t, n, e.schema.marks.em);
		}
	}],
	keymap: { "Mod-i": (e, t) => {
		let n = e.schema.marks.em;
		return n ? R(n)(e, t) : !1;
	} }
}), $t = /* @__PURE__ */ h({
	emMark: () => Qt,
	strongMark: () => Zt
}), en = class {
	constructor(e, n = {}) {
		this.view = null, this.toolbarManager = null, this.slashMenuManager = null;
		let { enableToolbar: i = !0, enableSlashMenu: a = !0, blocks: o = [], marks: s = [] } = n;
		this.blocks = o, this.marks = s, o.some((e) => e.name === "paragraph") || o.unshift(Xt), s.some((e) => e.name === "strong") || s.unshift(Zt), s.some((e) => e.name === "em") || s.unshift(Qt);
		let l = Jt.build(o, s);
		wt();
		let u = [
			Dt,
			Et,
			kt,
			Nt,
			zt,
			xt(),
			Gt(o, s, l),
			se(lt)
		], d = o.find((e) => e.name === "paragraph") || o[0], f = d ? l.node("doc", null, [l.nodes[d.name]?.create({ dir: "rtl" })]) : l.node("doc", null, [l.nodes.paragraph?.create({ dir: "rtl" })]);
		if (this.view = new c(e, {
			state: t.create({
				schema: l,
				plugins: u,
				doc: f
			}),
			attributes: { class: "kateb-editor-container" }
		}), i && (this.toolbarManager = new Vt(this.view, this.blocks, this.marks)), a) {
			this.slashMenuManager = new Ut(this.view, this.blocks);
			let e = new r({ props: { handleTextInput: (e, t, n, r) => {
				if (r !== "/") return !1;
				let { state: i } = e, { $from: a } = i.selection, o = a.before(a.depth), s = i.doc.textBetween(o, t);
				return /^\s*$/.test(s) && setTimeout(() => {
					this.slashMenuManager?.show(t);
				}, 0), !1;
			} } }), t = new r({ props: { handleTextInput: (e, t, n, r) => (this.slashMenuManager?.isVisible && setTimeout(() => this.slashMenuManager?.updateFilter(), 0), !1) } }), n = this.view.state.reconfigure({ plugins: [
				...this.view.state.plugins,
				e,
				t
			] });
			this.view.updateState(n);
		}
	}
	getContent() {
		if (!this.view) throw Error("Editor is destroyed");
		return this.view.state.doc.toJSON();
	}
	destroy() {
		this.view &&= (this.view.destroy(), null), this.toolbarManager &&= (this.toolbarManager.destroy(), null), this.slashMenuManager &&= (this.slashMenuManager.destroy(), null);
	}
};
//#endregion
//#region src/core/helpers.ts
function tn(e, t, n = {}) {
	return new Z({
		name: e,
		spec: t,
		slashMenuItem: n.slashLabel ? {
			label: n.slashLabel,
			searchTerms: n.searchTerms
		} : void 0,
		allowedMarks: n.allowedMarks,
		toolbarButtons: n.toolbarButtons,
		keymap: n.keymap
	});
}
function nn(e, t, n = {}) {
	return new Q({
		name: e,
		spec: t,
		toolbarButtons: n.toolbarButtons,
		keymap: n.keymap
	});
}
function rn(e, t, n) {
	return {
		label: e,
		command: t,
		isActive: n
	};
}
function an(e, t) {
	return {
		label: e,
		searchTerms: t
	};
}
function on(e) {
	return e;
}
//#endregion
//#region src/blocks/heading.ts
var $ = (e) => {
	let { $from: t } = e.selection;
	return t.node(t.depth)?.attrs?.dir || "rtl";
}, sn = {
	label: "عنوان (Heading)",
	searchTerms: [
		"heading",
		"h1",
		"h2",
		"h3",
		"title",
		"عنوان",
		"ع"
	]
}, cn = (e) => ({
	label: `H${e}`,
	command: (t, n) => {
		let r = $(t);
		return L(t.schema.nodes.heading, {
			level: e,
			dir: r
		})(t, n);
	},
	isActive: (t) => {
		let { $from: n } = t.selection, r = n.node(n.depth);
		return r?.type.name === "heading" && r?.attrs.level === e;
	}
}), ln = new Z({
	name: "heading",
	spec: {
		attrs: {
			level: { default: 1 },
			dir: { default: "rtl" }
		},
		content: "inline*",
		group: "block",
		defining: !0,
		parseDOM: [
			{
				tag: "h1",
				getAttrs: (e) => typeof e == "string" ? {
					level: 1,
					dir: "rtl"
				} : {
					level: 1,
					dir: e.getAttribute("dir") || "rtl"
				}
			},
			{
				tag: "h2",
				getAttrs: (e) => typeof e == "string" ? {
					level: 2,
					dir: "rtl"
				} : {
					level: 2,
					dir: e.getAttribute("dir") || "rtl"
				}
			},
			{
				tag: "h3",
				getAttrs: (e) => typeof e == "string" ? {
					level: 3,
					dir: "rtl"
				} : {
					level: 3,
					dir: e.getAttribute("dir") || "rtl"
				}
			}
		],
		toDOM(e) {
			return [
				`h${e.attrs.level}`,
				{ dir: e.attrs.dir },
				0
			];
		}
	},
	slashMenuItem: sn,
	allowedMarks: ["strong", "em"],
	toolbarButtons: [
		cn(1),
		cn(2),
		cn(3)
	],
	keymap: {
		"Mod-Alt-1": (e, t) => {
			let n = $(e);
			return L(e.schema.nodes.heading, {
				level: 1,
				dir: n
			})(e, t);
		},
		"Mod-Alt-2": (e, t) => {
			let n = $(e);
			return L(e.schema.nodes.heading, {
				level: 2,
				dir: n
			})(e, t);
		},
		"Mod-Alt-3": (e, t) => {
			let n = $(e);
			return L(e.schema.nodes.heading, {
				level: 3,
				dir: n
			})(e, t);
		}
	}
}), un = /* @__PURE__ */ h({
	headingBlock: () => ln,
	paragraphBlock: () => Xt
});
//#endregion
export { Z as Block, en as KatebEditor, Q as Mark, un as blocks, tn as createBlock, on as createKeymap, nn as createMark, an as createSlashMenuItem, rn as createToolbarButton, $t as marks };

//# sourceMappingURL=kateb-editor.js.map