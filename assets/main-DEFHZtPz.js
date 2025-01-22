(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s);
  new MutationObserver((s) => {
    for (const a of s)
      if (a.type === "childList")
        for (const n of a.addedNodes)
          n.tagName === "LINK" && n.rel === "modulepreload" && i(n);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerPolicy && (a.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (a.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (a.credentials = "omit")
          : (a.credentials = "same-origin"),
      a
    );
  }
  function i(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = e(s);
    fetch(s.href, a);
  }
})();
function z(r) {
  return typeof r == "string" || r instanceof String;
}
function vt(r) {
  var t;
  return (
    typeof r == "object" &&
    r != null &&
    (r == null || (t = r.constructor) == null ? void 0 : t.name) === "Object"
  );
}
function bt(r, t) {
  return Array.isArray(t)
    ? bt(r, (e, i) => t.includes(i))
    : Object.entries(r).reduce((e, i) => {
        let [s, a] = i;
        return t(a, s) && (e[s] = a), e;
      }, {});
}
const h = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT",
};
function Rt(r) {
  switch (r) {
    case h.LEFT:
      return h.FORCE_LEFT;
    case h.RIGHT:
      return h.FORCE_RIGHT;
    default:
      return r;
  }
}
function rt(r) {
  return r.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function Y(r, t) {
  if (t === r) return !0;
  const e = Array.isArray(t),
    i = Array.isArray(r);
  let s;
  if (e && i) {
    if (t.length != r.length) return !1;
    for (s = 0; s < t.length; s++) if (!Y(t[s], r[s])) return !1;
    return !0;
  }
  if (e != i) return !1;
  if (t && r && typeof t == "object" && typeof r == "object") {
    const a = t instanceof Date,
      n = r instanceof Date;
    if (a && n) return t.getTime() == r.getTime();
    if (a != n) return !1;
    const o = t instanceof RegExp,
      u = r instanceof RegExp;
    if (o && u) return t.toString() == r.toString();
    if (o != u) return !1;
    const l = Object.keys(t);
    for (s = 0; s < l.length; s++)
      if (!Object.prototype.hasOwnProperty.call(r, l[s])) return !1;
    for (s = 0; s < l.length; s++) if (!Y(r[l[s]], t[l[s]])) return !1;
    return !0;
  } else if (t && r && typeof t == "function" && typeof r == "function")
    return t.toString() === r.toString();
  return !1;
}
class Ot {
  constructor(t) {
    for (
      Object.assign(this, t);
      this.value.slice(0, this.startChangePos) !==
      this.oldValue.slice(0, this.startChangePos);

    )
      --this.oldSelection.start;
    if (this.insertedCount)
      for (
        ;
        this.value.slice(this.cursorPos) !==
        this.oldValue.slice(this.oldSelection.end);

      )
        this.value.length - this.cursorPos <
        this.oldValue.length - this.oldSelection.end
          ? ++this.oldSelection.end
          : ++this.cursorPos;
  }
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  get removedCount() {
    return Math.max(
      this.oldSelection.end - this.startChangePos ||
        this.oldValue.length - this.value.length,
      0
    );
  }
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  get removeDirection() {
    return !this.removedCount || this.insertedCount
      ? h.NONE
      : (this.oldSelection.end === this.cursorPos ||
            this.oldSelection.start === this.cursorPos) &&
          this.oldSelection.end === this.oldSelection.start
        ? h.RIGHT
        : h.LEFT;
  }
}
function d(r, t) {
  return new d.InputMask(r, t);
}
function Et(r) {
  if (r == null) throw new Error("mask property should be defined");
  return r instanceof RegExp
    ? d.MaskedRegExp
    : z(r)
      ? d.MaskedPattern
      : r === Date
        ? d.MaskedDate
        : r === Number
          ? d.MaskedNumber
          : Array.isArray(r) || r === Array
            ? d.MaskedDynamic
            : d.Masked && r.prototype instanceof d.Masked
              ? r
              : d.Masked && r instanceof d.Masked
                ? r.constructor
                : r instanceof Function
                  ? d.MaskedFunction
                  : (console.warn("Mask not found for mask", r), d.Masked);
}
function H(r) {
  if (!r) throw new Error("Options in not defined");
  if (d.Masked) {
    if (r.prototype instanceof d.Masked) return { mask: r };
    const { mask: t = void 0, ...e } =
      r instanceof d.Masked
        ? { mask: r }
        : vt(r) && r.mask instanceof d.Masked
          ? r
          : {};
    if (t) {
      const i = t.mask;
      return {
        ...bt(t, (s, a) => !a.startsWith("_")),
        mask: t.constructor,
        _mask: i,
        ...e,
      };
    }
  }
  return vt(r) ? { ...r } : { mask: r };
}
function L(r) {
  if (d.Masked && r instanceof d.Masked) return r;
  const t = H(r),
    e = Et(t.mask);
  if (!e)
    throw new Error(
      "Masked class is not found for provided mask " +
        t.mask +
        ", appropriate module needs to be imported manually before creating mask."
    );
  return (
    t.mask === e && delete t.mask,
    t._mask && ((t.mask = t._mask), delete t._mask),
    new e(t)
  );
}
d.createMask = L;
class pt {
  get selectionStart() {
    let t;
    try {
      t = this._unsafeSelectionStart;
    } catch {}
    return t ?? this.value.length;
  }
  get selectionEnd() {
    let t;
    try {
      t = this._unsafeSelectionEnd;
    } catch {}
    return t ?? this.value.length;
  }
  select(t, e) {
    if (
      !(
        t == null ||
        e == null ||
        (t === this.selectionStart && e === this.selectionEnd)
      )
    )
      try {
        this._unsafeSelect(t, e);
      } catch {}
  }
  get isActive() {
    return !1;
  }
}
d.MaskElement = pt;
const kt = 90,
  zt = 89;
class Z extends pt {
  constructor(t) {
    super(),
      (this.input = t),
      (this._onKeydown = this._onKeydown.bind(this)),
      (this._onInput = this._onInput.bind(this)),
      (this._onBeforeinput = this._onBeforeinput.bind(this)),
      (this._onCompositionEnd = this._onCompositionEnd.bind(this));
  }
  get rootElement() {
    var t, e, i;
    return (t =
      (e = (i = this.input).getRootNode) == null ? void 0 : e.call(i)) != null
      ? t
      : document;
  }
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  bindEvents(t) {
    this.input.addEventListener("keydown", this._onKeydown),
      this.input.addEventListener("input", this._onInput),
      this.input.addEventListener("beforeinput", this._onBeforeinput),
      this.input.addEventListener("compositionend", this._onCompositionEnd),
      this.input.addEventListener("drop", t.drop),
      this.input.addEventListener("click", t.click),
      this.input.addEventListener("focus", t.focus),
      this.input.addEventListener("blur", t.commit),
      (this._handlers = t);
  }
  _onKeydown(t) {
    if (
      this._handlers.redo &&
      ((t.keyCode === kt && t.shiftKey && (t.metaKey || t.ctrlKey)) ||
        (t.keyCode === zt && t.ctrlKey))
    )
      return t.preventDefault(), this._handlers.redo(t);
    if (this._handlers.undo && t.keyCode === kt && (t.metaKey || t.ctrlKey))
      return t.preventDefault(), this._handlers.undo(t);
    t.isComposing || this._handlers.selectionChange(t);
  }
  _onBeforeinput(t) {
    if (t.inputType === "historyUndo" && this._handlers.undo)
      return t.preventDefault(), this._handlers.undo(t);
    if (t.inputType === "historyRedo" && this._handlers.redo)
      return t.preventDefault(), this._handlers.redo(t);
  }
  _onCompositionEnd(t) {
    this._handlers.input(t);
  }
  _onInput(t) {
    t.isComposing || this._handlers.input(t);
  }
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown),
      this.input.removeEventListener("input", this._onInput),
      this.input.removeEventListener("beforeinput", this._onBeforeinput),
      this.input.removeEventListener("compositionend", this._onCompositionEnd),
      this.input.removeEventListener("drop", this._handlers.drop),
      this.input.removeEventListener("click", this._handlers.click),
      this.input.removeEventListener("focus", this._handlers.focus),
      this.input.removeEventListener("blur", this._handlers.commit),
      (this._handlers = {});
  }
}
d.HTMLMaskElement = Z;
class Pt extends Z {
  constructor(t) {
    super(t), (this.input = t);
  }
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null
      ? this.input.selectionStart
      : this.value.length;
  }
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  _unsafeSelect(t, e) {
    this.input.setSelectionRange(t, e);
  }
  get value() {
    return this.input.value;
  }
  set value(t) {
    this.input.value = t;
  }
}
d.HTMLMaskElement = Z;
class Ct extends Z {
  get _unsafeSelectionStart() {
    const t = this.rootElement,
      e = t.getSelection && t.getSelection(),
      i = e && e.anchorOffset,
      s = e && e.focusOffset;
    return s == null || i == null || i < s ? i : s;
  }
  get _unsafeSelectionEnd() {
    const t = this.rootElement,
      e = t.getSelection && t.getSelection(),
      i = e && e.anchorOffset,
      s = e && e.focusOffset;
    return s == null || i == null || i > s ? i : s;
  }
  _unsafeSelect(t, e) {
    if (!this.rootElement.createRange) return;
    const i = this.rootElement.createRange();
    i.setStart(this.input.firstChild || this.input, t),
      i.setEnd(this.input.lastChild || this.input, e);
    const s = this.rootElement,
      a = s.getSelection && s.getSelection();
    a && (a.removeAllRanges(), a.addRange(i));
  }
  get value() {
    return this.input.textContent || "";
  }
  set value(t) {
    this.input.textContent = t;
  }
}
d.HTMLContenteditableMaskElement = Ct;
class X {
  constructor() {
    (this.states = []), (this.currentIndex = 0);
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(t) {
    this.currentIndex < this.states.length - 1 &&
      (this.states.length = this.currentIndex + 1),
      this.states.push(t),
      this.states.length > X.MAX_LENGTH && this.states.shift(),
      (this.currentIndex = this.states.length - 1);
  }
  go(t) {
    return (
      (this.currentIndex = Math.min(
        Math.max(this.currentIndex + t, 0),
        this.states.length - 1
      )),
      this.currentState
    );
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    (this.states.length = 0), (this.currentIndex = 0);
  }
}
X.MAX_LENGTH = 100;
class Ut {
  constructor(t, e) {
    (this.el =
      t instanceof pt
        ? t
        : t.isContentEditable &&
            t.tagName !== "INPUT" &&
            t.tagName !== "TEXTAREA"
          ? new Ct(t)
          : new Pt(t)),
      (this.masked = L(e)),
      (this._listeners = {}),
      (this._value = ""),
      (this._unmaskedValue = ""),
      (this._rawInputValue = ""),
      (this.history = new X()),
      (this._saveSelection = this._saveSelection.bind(this)),
      (this._onInput = this._onInput.bind(this)),
      (this._onChange = this._onChange.bind(this)),
      (this._onDrop = this._onDrop.bind(this)),
      (this._onFocus = this._onFocus.bind(this)),
      (this._onClick = this._onClick.bind(this)),
      (this._onUndo = this._onUndo.bind(this)),
      (this._onRedo = this._onRedo.bind(this)),
      (this.alignCursor = this.alignCursor.bind(this)),
      (this.alignCursorFriendly = this.alignCursorFriendly.bind(this)),
      this._bindEvents(),
      this.updateValue(),
      this._onChange();
  }
  maskEquals(t) {
    var e;
    return t == null || ((e = this.masked) == null ? void 0 : e.maskEquals(t));
  }
  get mask() {
    return this.masked.mask;
  }
  set mask(t) {
    if (this.maskEquals(t)) return;
    if (!(t instanceof d.Masked) && this.masked.constructor === Et(t)) {
      this.masked.updateOptions({ mask: t });
      return;
    }
    const e = t instanceof d.Masked ? t : L({ mask: t });
    (e.unmaskedValue = this.masked.unmaskedValue), (this.masked = e);
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.value !== t && ((this.masked.value = t), this.updateControl("auto"));
  }
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(t) {
    this.unmaskedValue !== t &&
      ((this.masked.unmaskedValue = t), this.updateControl("auto"));
  }
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(t) {
    this.rawInputValue !== t &&
      ((this.masked.rawInputValue = t),
      this.updateControl(),
      this.alignCursor());
  }
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(t) {
    this.masked.typedValueEquals(t) ||
      ((this.masked.typedValue = t), this.updateControl("auto"));
  }
  get displayValue() {
    return this.masked.displayValue;
  }
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo,
    });
  }
  _unbindEvents() {
    this.el && this.el.unbindEvents();
  }
  _fireEvent(t, e) {
    const i = this._listeners[t];
    i && i.forEach((s) => s(e));
  }
  get selectionStart() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionStart;
  }
  get cursorPos() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionEnd;
  }
  set cursorPos(t) {
    !this.el ||
      !this.el.isActive ||
      (this.el.select(t, t), this._saveSelection());
  }
  _saveSelection() {
    this.displayValue !== this.el.value &&
      console.warn(
        "Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."
      ),
      (this._selection = { start: this.selectionStart, end: this.cursorPos });
  }
  updateValue() {
    (this.masked.value = this.el.value),
      (this._value = this.masked.value),
      (this._unmaskedValue = this.masked.unmaskedValue),
      (this._rawInputValue = this.masked.rawInputValue);
  }
  updateControl(t) {
    const e = this.masked.unmaskedValue,
      i = this.masked.value,
      s = this.masked.rawInputValue,
      a = this.displayValue,
      n =
        this.unmaskedValue !== e ||
        this.value !== i ||
        this._rawInputValue !== s;
    (this._unmaskedValue = e),
      (this._value = i),
      (this._rawInputValue = s),
      this.el.value !== a && (this.el.value = a),
      t === "auto" ? this.alignCursor() : t != null && (this.cursorPos = t),
      n && this._fireChangeEvents(),
      !this._historyChanging &&
        (n || this.history.isEmpty) &&
        this.history.push({
          unmaskedValue: e,
          selection: { start: this.selectionStart, end: this.cursorPos },
        });
  }
  updateOptions(t) {
    const { mask: e, ...i } = t,
      s = !this.maskEquals(e),
      a = this.masked.optionsIsChanged(i);
    s && (this.mask = e),
      a && this.masked.updateOptions(i),
      (s || a) && this.updateControl();
  }
  updateCursor(t) {
    t != null && ((this.cursorPos = t), this._delayUpdateCursor(t));
  }
  _delayUpdateCursor(t) {
    this._abortUpdateCursor(),
      (this._changingCursorPos = t),
      (this._cursorChanging = setTimeout(() => {
        this.el &&
          ((this.cursorPos = this._changingCursorPos),
          this._abortUpdateCursor());
      }, 10));
  }
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent),
      this.masked.isComplete && this._fireEvent("complete", this._inputEvent);
  }
  _abortUpdateCursor() {
    this._cursorChanging &&
      (clearTimeout(this._cursorChanging), delete this._cursorChanging);
  }
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(
      this.masked.nearestInputPos(this.cursorPos, h.LEFT)
    );
  }
  alignCursorFriendly() {
    this.selectionStart === this.cursorPos && this.alignCursor();
  }
  on(t, e) {
    return (
      this._listeners[t] || (this._listeners[t] = []),
      this._listeners[t].push(e),
      this
    );
  }
  off(t, e) {
    if (!this._listeners[t]) return this;
    if (!e) return delete this._listeners[t], this;
    const i = this._listeners[t].indexOf(e);
    return i >= 0 && this._listeners[t].splice(i, 1), this;
  }
  _onInput(t) {
    (this._inputEvent = t), this._abortUpdateCursor();
    const e = new Ot({
        value: this.el.value,
        cursorPos: this.cursorPos,
        oldValue: this.displayValue,
        oldSelection: this._selection,
      }),
      i = this.masked.rawInputValue,
      s = this.masked.splice(
        e.startChangePos,
        e.removed.length,
        e.inserted,
        e.removeDirection,
        { input: !0, raw: !0 }
      ).offset,
      a = i === this.masked.rawInputValue ? e.removeDirection : h.NONE;
    let n = this.masked.nearestInputPos(e.startChangePos + s, a);
    a !== h.NONE && (n = this.masked.nearestInputPos(n, h.NONE)),
      this.updateControl(n),
      delete this._inputEvent;
  }
  _onChange() {
    this.displayValue !== this.el.value && this.updateValue(),
      this.masked.doCommit(),
      this.updateControl(),
      this._saveSelection();
  }
  _onDrop(t) {
    t.preventDefault(), t.stopPropagation();
  }
  _onFocus(t) {
    this.alignCursorFriendly();
  }
  _onClick(t) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(t) {
    t &&
      ((this._historyChanging = !0),
      (this.unmaskedValue = t.unmaskedValue),
      this.el.select(t.selection.start, t.selection.end),
      this._saveSelection(),
      (this._historyChanging = !1));
  }
  destroy() {
    this._unbindEvents(), (this._listeners.length = 0), delete this.el;
  }
}
d.InputMask = Ut;
class f {
  static normalize(t) {
    return Array.isArray(t) ? t : [t, new f()];
  }
  constructor(t) {
    Object.assign(
      this,
      { inserted: "", rawInserted: "", tailShift: 0, skip: !1 },
      t
    );
  }
  aggregate(t) {
    return (
      (this.inserted += t.inserted),
      (this.rawInserted += t.rawInserted),
      (this.tailShift += t.tailShift),
      (this.skip = this.skip || t.skip),
      this
    );
  }
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return !!this.rawInserted || this.skip;
  }
  equals(t) {
    return (
      this.inserted === t.inserted &&
      this.tailShift === t.tailShift &&
      this.rawInserted === t.rawInserted &&
      this.skip === t.skip
    );
  }
}
d.ChangeDetails = f;
class M {
  constructor(t, e, i) {
    t === void 0 && (t = ""),
      e === void 0 && (e = 0),
      (this.value = t),
      (this.from = e),
      (this.stop = i);
  }
  toString() {
    return this.value;
  }
  extend(t) {
    this.value += String(t);
  }
  appendTo(t) {
    return t
      .append(this.toString(), { tail: !0 })
      .aggregate(t._appendPlaceholder());
  }
  get state() {
    return { value: this.value, from: this.from, stop: this.stop };
  }
  set state(t) {
    Object.assign(this, t);
  }
  unshift(t) {
    if (!this.value.length || (t != null && this.from >= t)) return "";
    const e = this.value[0];
    return (this.value = this.value.slice(1)), e;
  }
  shift() {
    if (!this.value.length) return "";
    const t = this.value[this.value.length - 1];
    return (this.value = this.value.slice(0, -1)), t;
  }
}
class C {
  constructor(t) {
    (this._value = ""),
      this._update({ ...C.DEFAULTS, ...t }),
      (this._initialized = !0);
  }
  updateOptions(t) {
    this.optionsIsChanged(t) &&
      this.withValueRefresh(this._update.bind(this, t));
  }
  _update(t) {
    Object.assign(this, t);
  }
  get state() {
    return { _value: this.value, _rawInputValue: this.rawInputValue };
  }
  set state(t) {
    this._value = t._value;
  }
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(t) {
    this.resolve(t, { input: !0 });
  }
  resolve(t, e) {
    e === void 0 && (e = { input: !0 }),
      this.reset(),
      this.append(t, e, ""),
      this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(t) {
    this.resolve(t, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(t) {
    this.format
      ? (this.value = this.format(t, this))
      : (this.unmaskedValue = String(t));
  }
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, { raw: !0 });
  }
  set rawInputValue(t) {
    this.resolve(t, { raw: !0 });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return this.isComplete;
  }
  nearestInputPos(t, e) {
    return t;
  }
  totalInputPositions(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      Math.min(this.displayValue.length, e - t)
    );
  }
  extractInput(t, e, i) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      this.displayValue.slice(t, e)
    );
  }
  extractTail(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      new M(this.extractInput(t, e), t)
    );
  }
  appendTail(t) {
    return z(t) && (t = new M(String(t))), t.appendTo(this);
  }
  _appendCharRaw(t, e) {
    return t
      ? ((this._value += t), new f({ inserted: t, rawInserted: t }))
      : new f();
  }
  _appendChar(t, e, i) {
    e === void 0 && (e = {});
    const s = this.state;
    let a;
    if (
      (([t, a] = this.doPrepareChar(t, e)),
      t &&
        ((a = a.aggregate(this._appendCharRaw(t, e))),
        !a.rawInserted && this.autofix === "pad"))
    ) {
      const n = this.state;
      this.state = s;
      let o = this.pad(e);
      const u = this._appendCharRaw(t, e);
      (o = o.aggregate(u)),
        u.rawInserted || o.equals(a) ? (a = o) : (this.state = n);
    }
    if (a.inserted) {
      let n,
        o = this.doValidate(e) !== !1;
      if (o && i != null) {
        const u = this.state;
        if (this.overwrite === !0) {
          n = i.state;
          for (let k = 0; k < a.rawInserted.length; ++k)
            i.unshift(this.displayValue.length - a.tailShift);
        }
        let l = this.appendTail(i);
        if (
          ((o = l.rawInserted.length === i.toString().length),
          !(o && l.inserted) && this.overwrite === "shift")
        ) {
          (this.state = u), (n = i.state);
          for (let k = 0; k < a.rawInserted.length; ++k) i.shift();
          (l = this.appendTail(i)),
            (o = l.rawInserted.length === i.toString().length);
        }
        o && l.inserted && (this.state = u);
      }
      o || ((a = new f()), (this.state = s), i && n && (i.state = n));
    }
    return a;
  }
  _appendPlaceholder() {
    return new f();
  }
  _appendEager() {
    return new f();
  }
  append(t, e, i) {
    if (!z(t)) throw new Error("value should be string");
    const s = z(i) ? new M(String(i)) : i;
    e != null && e.tail && (e._beforeTailState = this.state);
    let a;
    [t, a] = this.doPrepare(t, e);
    for (let n = 0; n < t.length; ++n) {
      const o = this._appendChar(t[n], e, s);
      if (!o.rawInserted && !this.doSkipInvalid(t[n], e, s)) break;
      a.aggregate(o);
    }
    return (
      (this.eager === !0 || this.eager === "append") &&
        e != null &&
        e.input &&
        t &&
        a.aggregate(this._appendEager()),
      s != null && (a.tailShift += this.appendTail(s).tailShift),
      a
    );
  }
  remove(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      (this._value =
        this.displayValue.slice(0, t) + this.displayValue.slice(e)),
      new f()
    );
  }
  withValueRefresh(t) {
    if (this._refreshing || !this._initialized) return t();
    this._refreshing = !0;
    const e = this.rawInputValue,
      i = this.value,
      s = t();
    return (
      (this.rawInputValue = e),
      this.value &&
        this.value !== i &&
        i.indexOf(this.value) === 0 &&
        (this.append(i.slice(this.displayValue.length), {}, ""),
        this.doCommit()),
      delete this._refreshing,
      s
    );
  }
  runIsolated(t) {
    if (this._isolated || !this._initialized) return t(this);
    this._isolated = !0;
    const e = this.state,
      i = t(this);
    return (this.state = e), delete this._isolated, i;
  }
  doSkipInvalid(t, e, i) {
    return !!this.skipInvalid;
  }
  doPrepare(t, e) {
    return (
      e === void 0 && (e = {}),
      f.normalize(this.prepare ? this.prepare(t, this, e) : t)
    );
  }
  doPrepareChar(t, e) {
    return (
      e === void 0 && (e = {}),
      f.normalize(this.prepareChar ? this.prepareChar(t, this, e) : t)
    );
  }
  doValidate(t) {
    return (
      (!this.validate || this.validate(this.value, this, t)) &&
      (!this.parent || this.parent.doValidate(t))
    );
  }
  doCommit() {
    this.commit && this.commit(this.value, this);
  }
  splice(t, e, i, s, a) {
    i === void 0 && (i = ""),
      s === void 0 && (s = h.NONE),
      a === void 0 && (a = { input: !0 });
    const n = t + e,
      o = this.extractTail(n),
      u = this.eager === !0 || this.eager === "remove";
    let l;
    u && ((s = Rt(s)), (l = this.extractInput(0, n, { raw: !0 })));
    let k = t;
    const y = new f();
    if (
      (s !== h.NONE &&
        ((k = this.nearestInputPos(t, e > 1 && t !== 0 && !u ? h.NONE : s)),
        (y.tailShift = k - t)),
      y.aggregate(this.remove(k)),
      u && s !== h.NONE && l === this.rawInputValue)
    )
      if (s === h.FORCE_LEFT) {
        let _;
        for (; l === this.rawInputValue && (_ = this.displayValue.length); )
          y.aggregate(new f({ tailShift: -1 })).aggregate(this.remove(_ - 1));
      } else s === h.FORCE_RIGHT && o.unshift();
    return y.aggregate(this.append(i, a, o));
  }
  maskEquals(t) {
    return this.mask === t;
  }
  optionsIsChanged(t) {
    return !Y(this, t);
  }
  typedValueEquals(t) {
    const e = this.typedValue;
    return (
      t === e ||
      (C.EMPTY_VALUES.includes(t) && C.EMPTY_VALUES.includes(e)) ||
      (this.format
        ? this.format(t, this) === this.format(this.typedValue, this)
        : !1)
    );
  }
  pad(t) {
    return new f();
  }
}
C.DEFAULTS = { skipInvalid: !0 };
C.EMPTY_VALUES = [void 0, null, ""];
d.Masked = C;
class j {
  constructor(t, e) {
    t === void 0 && (t = []),
      e === void 0 && (e = 0),
      (this.chunks = t),
      (this.from = e);
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(t) {
    if (!String(t)) return;
    t = z(t) ? new M(String(t)) : t;
    const e = this.chunks[this.chunks.length - 1],
      i =
        e &&
        (e.stop === t.stop || t.stop == null) &&
        t.from === e.from + e.toString().length;
    if (t instanceof M) i ? e.extend(t.toString()) : this.chunks.push(t);
    else if (t instanceof j) {
      if (t.stop == null) {
        let s;
        for (; t.chunks.length && t.chunks[0].stop == null; )
          (s = t.chunks.shift()), (s.from += t.from), this.extend(s);
      }
      t.toString() && ((t.stop = t.blockIndex), this.chunks.push(t));
    }
  }
  appendTo(t) {
    if (!(t instanceof d.MaskedPattern))
      return new M(this.toString()).appendTo(t);
    const e = new f();
    for (let i = 0; i < this.chunks.length; ++i) {
      const s = this.chunks[i],
        a = t._mapPosToBlock(t.displayValue.length),
        n = s.stop;
      let o;
      if (
        (n != null &&
          (!a || a.index <= n) &&
          ((s instanceof j || t._stops.indexOf(n) >= 0) &&
            e.aggregate(t._appendPlaceholder(n)),
          (o = s instanceof j && t._blocks[n])),
        o)
      ) {
        const u = o.appendTail(s);
        e.aggregate(u);
        const l = s.toString().slice(u.rawInserted.length);
        l && e.aggregate(t.append(l, { tail: !0 }));
      } else e.aggregate(t.append(s.toString(), { tail: !0 }));
    }
    return e;
  }
  get state() {
    return {
      chunks: this.chunks.map((t) => t.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex,
    };
  }
  set state(t) {
    const { chunks: e, ...i } = t;
    Object.assign(this, i),
      (this.chunks = e.map((s) => {
        const a = "chunks" in s ? new j() : new M();
        return (a.state = s), a;
      }));
  }
  unshift(t) {
    if (!this.chunks.length || (t != null && this.from >= t)) return "";
    const e = t != null ? t - this.from : t;
    let i = 0;
    for (; i < this.chunks.length; ) {
      const s = this.chunks[i],
        a = s.unshift(e);
      if (s.toString()) {
        if (!a) break;
        ++i;
      } else this.chunks.splice(i, 1);
      if (a) return a;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let t = this.chunks.length - 1;
    for (; 0 <= t; ) {
      const e = this.chunks[t],
        i = e.shift();
      if (e.toString()) {
        if (!i) break;
        --t;
      } else this.chunks.splice(t, 1);
      if (i) return i;
    }
    return "";
  }
}
class jt {
  constructor(t, e) {
    (this.masked = t), (this._log = []);
    const { offset: i, index: s } =
      t._mapPosToBlock(e) ||
      (e < 0
        ? { index: 0, offset: 0 }
        : { index: this.masked._blocks.length, offset: 0 });
    (this.offset = i), (this.index = s), (this.ok = !1);
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return { index: this.index, offset: this.offset, ok: this.ok };
  }
  set state(t) {
    Object.assign(this, t);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const t = this._log.pop();
    return t && (this.state = t), t;
  }
  bindBlock() {
    this.block ||
      (this.index < 0 && ((this.index = 0), (this.offset = 0)),
      this.index >= this.masked._blocks.length &&
        ((this.index = this.masked._blocks.length - 1),
        (this.offset = this.block.displayValue.length)));
  }
  _pushLeft(t) {
    for (
      this.pushState(), this.bindBlock();
      0 <= this.index;
      --this.index,
        this.offset =
          ((e = this.block) == null ? void 0 : e.displayValue.length) || 0
    ) {
      var e;
      if (t()) return (this.ok = !0);
    }
    return (this.ok = !1);
  }
  _pushRight(t) {
    for (
      this.pushState(), this.bindBlock();
      this.index < this.masked._blocks.length;
      ++this.index, this.offset = 0
    )
      if (t()) return (this.ok = !0);
    return (this.ok = !1);
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (
        !(this.block.isFixed || !this.block.value) &&
        ((this.offset = this.block.nearestInputPos(this.offset, h.FORCE_LEFT)),
        this.offset !== 0)
      )
        return !0;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (!this.block.isFixed)
        return (
          (this.offset = this.block.nearestInputPos(this.offset, h.LEFT)), !0
        );
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (!(this.block.isFixed || (this.block.isOptional && !this.block.value)))
        return (
          (this.offset = this.block.nearestInputPos(this.offset, h.LEFT)), !0
        );
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (
        !(this.block.isFixed || !this.block.value) &&
        ((this.offset = this.block.nearestInputPos(this.offset, h.FORCE_RIGHT)),
        this.offset !== this.block.value.length)
      )
        return !0;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (!this.block.isFixed)
        return (
          (this.offset = this.block.nearestInputPos(this.offset, h.NONE)), !0
        );
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (!(this.block.isFixed || (this.block.isOptional && !this.block.value)))
        return (
          (this.offset = this.block.nearestInputPos(this.offset, h.NONE)), !0
        );
    });
  }
}
class wt {
  constructor(t) {
    Object.assign(this, t), (this._value = ""), (this.isFixed = !0);
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    (this._isRawInput = !1), (this._value = "");
  }
  remove(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this._value.length),
      (this._value = this._value.slice(0, t) + this._value.slice(e)),
      this._value || (this._isRawInput = !1),
      new f()
    );
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = h.NONE);
    const i = 0,
      s = this._value.length;
    switch (e) {
      case h.LEFT:
      case h.FORCE_LEFT:
        return i;
      case h.NONE:
      case h.RIGHT:
      case h.FORCE_RIGHT:
      default:
        return s;
    }
  }
  totalInputPositions(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this._value.length),
      this._isRawInput ? e - t : 0
    );
  }
  extractInput(t, e, i) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this._value.length),
      i === void 0 && (i = {}),
      (i.raw && this._isRawInput && this._value.slice(t, e)) || ""
    );
  }
  get isComplete() {
    return !0;
  }
  get isFilled() {
    return !!this._value;
  }
  _appendChar(t, e) {
    if ((e === void 0 && (e = {}), this.isFilled)) return new f();
    const i = this.eager === !0 || this.eager === "append",
      a =
        this.char === t &&
        (this.isUnmasking || e.input || e.raw) &&
        (!e.raw || !i) &&
        !e.tail,
      n = new f({ inserted: this.char, rawInserted: a ? this.char : "" });
    return (
      (this._value = this.char), (this._isRawInput = a && (e.raw || e.input)), n
    );
  }
  _appendEager() {
    return this._appendChar(this.char, { tail: !0 });
  }
  _appendPlaceholder() {
    const t = new f();
    return this.isFilled || (this._value = t.inserted = this.char), t;
  }
  extractTail() {
    return new M("");
  }
  appendTail(t) {
    return z(t) && (t = new M(String(t))), t.appendTo(this);
  }
  append(t, e, i) {
    const s = this._appendChar(t[0], e);
    return i != null && (s.tailShift += this.appendTail(i).tailShift), s;
  }
  doCommit() {}
  get state() {
    return { _value: this._value, _rawInputValue: this.rawInputValue };
  }
  set state(t) {
    (this._value = t._value), (this._isRawInput = !!t._rawInputValue);
  }
  pad(t) {
    return this._appendPlaceholder();
  }
}
class $ {
  constructor(t) {
    const {
      parent: e,
      isOptional: i,
      placeholderChar: s,
      displayChar: a,
      lazy: n,
      eager: o,
      ...u
    } = t;
    (this.masked = L(u)),
      Object.assign(this, {
        parent: e,
        isOptional: i,
        placeholderChar: s,
        displayChar: a,
        lazy: n,
        eager: o,
      });
  }
  reset() {
    (this.isFilled = !1), this.masked.reset();
  }
  remove(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.value.length),
      t === 0 && e >= 1
        ? ((this.isFilled = !1), this.masked.remove(t, e))
        : new f()
    );
  }
  get value() {
    return (
      this.masked.value ||
      (this.isFilled && !this.isOptional ? this.placeholderChar : "")
    );
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return (this.masked.value && this.displayChar) || this.value;
  }
  get isComplete() {
    return !!this.masked.value || this.isOptional;
  }
  _appendChar(t, e) {
    if ((e === void 0 && (e = {}), this.isFilled)) return new f();
    const i = this.masked.state;
    let s = this.masked._appendChar(t, this.currentMaskFlags(e));
    return (
      s.inserted &&
        this.doValidate(e) === !1 &&
        ((s = new f()), (this.masked.state = i)),
      !s.inserted &&
        !this.isOptional &&
        !this.lazy &&
        !e.input &&
        (s.inserted = this.placeholderChar),
      (s.skip = !s.inserted && !this.isOptional),
      (this.isFilled = !!s.inserted),
      s
    );
  }
  append(t, e, i) {
    return this.masked.append(t, this.currentMaskFlags(e), i);
  }
  _appendPlaceholder() {
    return this.isFilled || this.isOptional
      ? new f()
      : ((this.isFilled = !0), new f({ inserted: this.placeholderChar }));
  }
  _appendEager() {
    return new f();
  }
  extractTail(t, e) {
    return this.masked.extractTail(t, e);
  }
  appendTail(t) {
    return this.masked.appendTail(t);
  }
  extractInput(t, e, i) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.value.length),
      this.masked.extractInput(t, e, i)
    );
  }
  nearestInputPos(t, e) {
    e === void 0 && (e = h.NONE);
    const i = 0,
      s = this.value.length,
      a = Math.min(Math.max(t, i), s);
    switch (e) {
      case h.LEFT:
      case h.FORCE_LEFT:
        return this.isComplete ? a : i;
      case h.RIGHT:
      case h.FORCE_RIGHT:
        return this.isComplete ? a : s;
      case h.NONE:
      default:
        return a;
    }
  }
  totalInputPositions(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.value.length),
      this.value.slice(t, e).length
    );
  }
  doValidate(t) {
    return (
      this.masked.doValidate(this.currentMaskFlags(t)) &&
      (!this.parent || this.parent.doValidate(this.currentMaskFlags(t)))
    );
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled,
    };
  }
  set state(t) {
    (this.masked.state = t.masked), (this.isFilled = t.isFilled);
  }
  currentMaskFlags(t) {
    var e;
    return {
      ...t,
      _beforeTailState:
        (t == null || (e = t._beforeTailState) == null ? void 0 : e.masked) ||
        (t == null ? void 0 : t._beforeTailState),
    };
  }
  pad(t) {
    return new f();
  }
}
$.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  "*": /./,
};
class qt extends C {
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const e = t.mask;
    e && (t.validate = (i) => i.search(e) >= 0), super._update(t);
  }
}
d.MaskedRegExp = qt;
class w extends C {
  constructor(t) {
    super({
      ...w.DEFAULTS,
      ...t,
      definitions: Object.assign(
        {},
        $.DEFAULT_DEFINITIONS,
        t == null ? void 0 : t.definitions
      ),
    });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    (t.definitions = Object.assign({}, this.definitions, t.definitions)),
      super._update(t),
      this._rebuildMask();
  }
  _rebuildMask() {
    const t = this.definitions;
    (this._blocks = []),
      (this.exposeBlock = void 0),
      (this._stops = []),
      (this._maskedBlocks = {});
    const e = this.mask;
    if (!e || !t) return;
    let i = !1,
      s = !1;
    for (let a = 0; a < e.length; ++a) {
      if (this.blocks) {
        const l = e.slice(a),
          k = Object.keys(this.blocks).filter((_) => l.indexOf(_) === 0);
        k.sort((_, T) => T.length - _.length);
        const y = k[0];
        if (y) {
          const { expose: _, repeat: T, ...R } = H(this.blocks[y]),
            I = {
              lazy: this.lazy,
              eager: this.eager,
              placeholderChar: this.placeholderChar,
              displayChar: this.displayChar,
              overwrite: this.overwrite,
              autofix: this.autofix,
              ...R,
              repeat: T,
              parent: this,
            },
            V = T != null ? new d.RepeatBlock(I) : L(I);
          V &&
            (this._blocks.push(V),
            _ && (this.exposeBlock = V),
            this._maskedBlocks[y] || (this._maskedBlocks[y] = []),
            this._maskedBlocks[y].push(this._blocks.length - 1)),
            (a += y.length - 1);
          continue;
        }
      }
      let n = e[a],
        o = n in t;
      if (n === w.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (n === "{" || n === "}") {
        i = !i;
        continue;
      }
      if (n === "[" || n === "]") {
        s = !s;
        continue;
      }
      if (n === w.ESCAPE_CHAR) {
        if ((++a, (n = e[a]), !n)) break;
        o = !1;
      }
      const u = o
        ? new $({
            isOptional: s,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            ...H(t[n]),
            parent: this,
          })
        : new wt({ char: n, eager: this.eager, isUnmasking: i });
      this._blocks.push(u);
    }
  }
  get state() {
    return { ...super.state, _blocks: this._blocks.map((t) => t.state) };
  }
  set state(t) {
    if (!t) {
      this.reset();
      return;
    }
    const { _blocks: e, ...i } = t;
    this._blocks.forEach((s, a) => (s.state = e[a])), (super.state = i);
  }
  reset() {
    super.reset(), this._blocks.forEach((t) => t.reset());
  }
  get isComplete() {
    return this.exposeBlock
      ? this.exposeBlock.isComplete
      : this._blocks.every((t) => t.isComplete);
  }
  get isFilled() {
    return this._blocks.every((t) => t.isFilled);
  }
  get isFixed() {
    return this._blocks.every((t) => t.isFixed);
  }
  get isOptional() {
    return this._blocks.every((t) => t.isOptional);
  }
  doCommit() {
    this._blocks.forEach((t) => t.doCommit()), super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock
      ? this.exposeBlock.unmaskedValue
      : this._blocks.reduce((t, e) => (t += e.unmaskedValue), "");
  }
  set unmaskedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.unmaskedValue = t), this.appendTail(e), this.doCommit();
    } else super.unmaskedValue = t;
  }
  get value() {
    return this.exposeBlock
      ? this.exposeBlock.value
      : this._blocks.reduce((t, e) => (t += e.value), "");
  }
  set value(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.value = t), this.appendTail(e), this.doCommit();
    } else super.value = t;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(t) {
    if (this.exposeBlock) {
      const e = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      (this.exposeBlock.typedValue = t), this.appendTail(e), this.doCommit();
    } else super.typedValue = t;
  }
  get displayValue() {
    return this._blocks.reduce((t, e) => (t += e.displayValue), "");
  }
  appendTail(t) {
    return super.appendTail(t).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var t;
    const e = new f();
    let i =
      (t = this._mapPosToBlock(this.displayValue.length)) == null
        ? void 0
        : t.index;
    if (i == null) return e;
    this._blocks[i].isFilled && ++i;
    for (let s = i; s < this._blocks.length; ++s) {
      const a = this._blocks[s]._appendEager();
      if (!a.inserted) break;
      e.aggregate(a);
    }
    return e;
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = this._mapPosToBlock(this.displayValue.length),
      s = new f();
    if (!i) return s;
    for (let n = i.index, o; (o = this._blocks[n]); ++n) {
      var a;
      const u = o._appendChar(t, {
        ...e,
        _beforeTailState:
          (a = e._beforeTailState) == null || (a = a._blocks) == null
            ? void 0
            : a[n],
      });
      if ((s.aggregate(u), u.consumed)) break;
    }
    return s;
  }
  extractTail(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = new j();
    return (
      t === e ||
        this._forEachBlocksInRange(t, e, (s, a, n, o) => {
          const u = s.extractTail(n, o);
          (u.stop = this._findStopBefore(a)),
            (u.from = this._blockStartPos(a)),
            u instanceof j && (u.blockIndex = a),
            i.extend(u);
        }),
      i
    );
  }
  extractInput(t, e, i) {
    if (
      (t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      i === void 0 && (i = {}),
      t === e)
    )
      return "";
    let s = "";
    return (
      this._forEachBlocksInRange(t, e, (a, n, o, u) => {
        s += a.extractInput(o, u, i);
      }),
      s
    );
  }
  _findStopBefore(t) {
    let e;
    for (let i = 0; i < this._stops.length; ++i) {
      const s = this._stops[i];
      if (s <= t) e = s;
      else break;
    }
    return e;
  }
  _appendPlaceholder(t) {
    const e = new f();
    if (this.lazy && t == null) return e;
    const i = this._mapPosToBlock(this.displayValue.length);
    if (!i) return e;
    const s = i.index,
      a = t ?? this._blocks.length;
    return (
      this._blocks.slice(s, a).forEach((n) => {
        if (!n.lazy || t != null) {
          var o;
          e.aggregate(
            n._appendPlaceholder((o = n._blocks) == null ? void 0 : o.length)
          );
        }
      }),
      e
    );
  }
  _mapPosToBlock(t) {
    let e = "";
    for (let i = 0; i < this._blocks.length; ++i) {
      const s = this._blocks[i],
        a = e.length;
      if (((e += s.displayValue), t <= e.length))
        return { index: i, offset: t - a };
    }
  }
  _blockStartPos(t) {
    return this._blocks
      .slice(0, t)
      .reduce((e, i) => (e += i.displayValue.length), 0);
  }
  _forEachBlocksInRange(t, e, i) {
    e === void 0 && (e = this.displayValue.length);
    const s = this._mapPosToBlock(t);
    if (s) {
      const a = this._mapPosToBlock(e),
        n = a && s.index === a.index,
        o = s.offset,
        u = a && n ? a.offset : this._blocks[s.index].displayValue.length;
      if ((i(this._blocks[s.index], s.index, o, u), a && !n)) {
        for (let l = s.index + 1; l < a.index; ++l)
          i(this._blocks[l], l, 0, this._blocks[l].displayValue.length);
        i(this._blocks[a.index], a.index, 0, a.offset);
      }
    }
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = super.remove(t, e);
    return (
      this._forEachBlocksInRange(t, e, (s, a, n, o) => {
        i.aggregate(s.remove(n, o));
      }),
      i
    );
  }
  nearestInputPos(t, e) {
    if ((e === void 0 && (e = h.NONE), !this._blocks.length)) return 0;
    const i = new jt(this, t);
    if (e === h.NONE)
      return i.pushRightBeforeInput() || (i.popState(), i.pushLeftBeforeInput())
        ? i.pos
        : this.displayValue.length;
    if (e === h.LEFT || e === h.FORCE_LEFT) {
      if (e === h.LEFT) {
        if ((i.pushRightBeforeFilled(), i.ok && i.pos === t)) return t;
        i.popState();
      }
      if (
        (i.pushLeftBeforeInput(),
        i.pushLeftBeforeRequired(),
        i.pushLeftBeforeFilled(),
        e === h.LEFT)
      ) {
        if (
          (i.pushRightBeforeInput(),
          i.pushRightBeforeRequired(),
          (i.ok && i.pos <= t) || (i.popState(), i.ok && i.pos <= t))
        )
          return i.pos;
        i.popState();
      }
      return i.ok
        ? i.pos
        : e === h.FORCE_LEFT
          ? 0
          : (i.popState(), i.ok || (i.popState(), i.ok) ? i.pos : 0);
    }
    return e === h.RIGHT || e === h.FORCE_RIGHT
      ? (i.pushRightBeforeInput(),
        i.pushRightBeforeRequired(),
        i.pushRightBeforeFilled()
          ? i.pos
          : e === h.FORCE_RIGHT
            ? this.displayValue.length
            : (i.popState(),
              i.ok || (i.popState(), i.ok)
                ? i.pos
                : this.nearestInputPos(t, h.LEFT)))
      : t;
  }
  totalInputPositions(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    let i = 0;
    return (
      this._forEachBlocksInRange(t, e, (s, a, n, o) => {
        i += s.totalInputPositions(n, o);
      }),
      i
    );
  }
  maskedBlock(t) {
    return this.maskedBlocks(t)[0];
  }
  maskedBlocks(t) {
    const e = this._maskedBlocks[t];
    return e ? e.map((i) => this._blocks[i]) : [];
  }
  pad(t) {
    const e = new f();
    return (
      this._forEachBlocksInRange(0, this.displayValue.length, (i) =>
        e.aggregate(i.pad(t))
      ),
      e
    );
  }
}
w.DEFAULTS = { ...C.DEFAULTS, lazy: !0, placeholderChar: "_" };
w.STOP_CHAR = "`";
w.ESCAPE_CHAR = "\\";
w.InputDefinition = $;
w.FixedDefinition = wt;
d.MaskedPattern = w;
class G extends w {
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const {
      to: e = this.to || 0,
      from: i = this.from || 0,
      maxLength: s = this.maxLength || 0,
      autofix: a = this.autofix,
      ...n
    } = t;
    (this.to = e),
      (this.from = i),
      (this.maxLength = Math.max(String(e).length, s)),
      (this.autofix = a);
    const o = String(this.from).padStart(this.maxLength, "0"),
      u = String(this.to).padStart(this.maxLength, "0");
    let l = 0;
    for (; l < u.length && u[l] === o[l]; ) ++l;
    (n.mask =
      u.slice(0, l).replace(/0/g, "\\0") + "0".repeat(this.maxLength - l)),
      super._update(n);
  }
  get isComplete() {
    return super.isComplete && !!this.value;
  }
  boundaries(t) {
    let e = "",
      i = "";
    const [, s, a] = t.match(/^(\D*)(\d*)(\D*)/) || [];
    return (
      a && ((e = "0".repeat(s.length) + a), (i = "9".repeat(s.length) + a)),
      (e = e.padEnd(this.maxLength, "0")),
      (i = i.padEnd(this.maxLength, "9")),
      [e, i]
    );
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let i;
    return (
      ([t, i] = super.doPrepareChar(t.replace(/\D/g, ""), e)),
      t || (i.skip = !this.isComplete),
      [t, i]
    );
  }
  _appendCharRaw(t, e) {
    if (
      (e === void 0 && (e = {}),
      !this.autofix || this.value.length + 1 > this.maxLength)
    )
      return super._appendCharRaw(t, e);
    const i = String(this.from).padStart(this.maxLength, "0"),
      s = String(this.to).padStart(this.maxLength, "0"),
      [a, n] = this.boundaries(this.value + t);
    return Number(n) < this.from
      ? super._appendCharRaw(i[this.value.length], e)
      : Number(a) > this.to
        ? !e.tail &&
          this.autofix === "pad" &&
          this.value.length + 1 < this.maxLength
          ? super
              ._appendCharRaw(i[this.value.length], e)
              .aggregate(this._appendCharRaw(t, e))
          : super._appendCharRaw(s[this.value.length], e)
        : super._appendCharRaw(t, e);
  }
  doValidate(t) {
    const e = this.value;
    if (e.search(/[^0]/) === -1 && e.length <= this._matchFrom) return !0;
    const [s, a] = this.boundaries(e);
    return (
      this.from <= Number(a) && Number(s) <= this.to && super.doValidate(t)
    );
  }
  pad(t) {
    const e = new f();
    if (this.value.length === this.maxLength) return e;
    const i = this.value,
      s = this.maxLength - this.value.length;
    if (s) {
      this.reset();
      for (let a = 0; a < s; ++a) e.aggregate(super._appendCharRaw("0", t));
      i.split("").forEach((a) => this._appendCharRaw(a));
    }
    return e;
  }
}
d.MaskedRange = G;
const Ht = "d{.}`m{.}`Y";
class N extends w {
  static extractPatternOptions(t) {
    const { mask: e, pattern: i, ...s } = t;
    return { ...s, mask: z(e) ? e : i };
  }
  constructor(t) {
    super(N.extractPatternOptions({ ...N.DEFAULTS, ...t }));
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const { mask: e, pattern: i, blocks: s, ...a } = { ...N.DEFAULTS, ...t },
      n = Object.assign({}, N.GET_DEFAULT_BLOCKS());
    t.min && (n.Y.from = t.min.getFullYear()),
      t.max && (n.Y.to = t.max.getFullYear()),
      t.min &&
        t.max &&
        n.Y.from === n.Y.to &&
        ((n.m.from = t.min.getMonth() + 1),
        (n.m.to = t.max.getMonth() + 1),
        n.m.from === n.m.to &&
          ((n.d.from = t.min.getDate()), (n.d.to = t.max.getDate()))),
      Object.assign(n, this.blocks, s),
      super._update({ ...a, mask: z(e) ? e : i, blocks: n });
  }
  doValidate(t) {
    const e = this.date;
    return (
      super.doValidate(t) &&
      (!this.isComplete ||
        (this.isDateExist(this.value) &&
          e != null &&
          (this.min == null || this.min <= e) &&
          (this.max == null || e <= this.max)))
    );
  }
  isDateExist(t) {
    return this.format(this.parse(t, this), this).indexOf(t) >= 0;
  }
  get date() {
    return this.typedValue;
  }
  set date(t) {
    this.typedValue = t;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(t) {
    super.typedValue = t;
  }
  maskEquals(t) {
    return t === Date || super.maskEquals(t);
  }
  optionsIsChanged(t) {
    return super.optionsIsChanged(N.extractPatternOptions(t));
  }
}
N.GET_DEFAULT_BLOCKS = () => ({
  d: { mask: G, from: 1, to: 31, maxLength: 2 },
  m: { mask: G, from: 1, to: 12, maxLength: 2 },
  Y: { mask: G, from: 1900, to: 9999 },
});
N.DEFAULTS = {
  ...w.DEFAULTS,
  mask: Date,
  pattern: Ht,
  format: (r, t) => {
    if (!r) return "";
    const e = String(r.getDate()).padStart(2, "0"),
      i = String(r.getMonth() + 1).padStart(2, "0"),
      s = r.getFullYear();
    return [e, i, s].join(".");
  },
  parse: (r, t) => {
    const [e, i, s] = r.split(".").map(Number);
    return new Date(s, i - 1, e);
  },
};
d.MaskedDate = N;
class Q extends C {
  constructor(t) {
    super({ ...Q.DEFAULTS, ...t }), (this.currentMask = void 0);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t),
      "mask" in t &&
        ((this.exposeMask = void 0),
        (this.compiledMasks = Array.isArray(t.mask)
          ? t.mask.map((e) => {
              const { expose: i, ...s } = H(e),
                a = L({
                  overwrite: this._overwrite,
                  eager: this._eager,
                  skipInvalid: this._skipInvalid,
                  ...s,
                });
              return i && (this.exposeMask = a), a;
            })
          : []));
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = this._applyDispatch(t, e);
    return (
      this.currentMask &&
        i.aggregate(this.currentMask._appendChar(t, this.currentMaskFlags(e))),
      i
    );
  }
  _applyDispatch(t, e, i) {
    t === void 0 && (t = ""),
      e === void 0 && (e = {}),
      i === void 0 && (i = "");
    const s =
        e.tail && e._beforeTailState != null
          ? e._beforeTailState._value
          : this.value,
      a = this.rawInputValue,
      n =
        e.tail && e._beforeTailState != null
          ? e._beforeTailState._rawInputValue
          : a,
      o = a.slice(n.length),
      u = this.currentMask,
      l = new f(),
      k = u == null ? void 0 : u.state;
    return (
      (this.currentMask = this.doDispatch(t, { ...e }, i)),
      this.currentMask &&
        (this.currentMask !== u
          ? (this.currentMask.reset(),
            n &&
              (this.currentMask.append(n, { raw: !0 }),
              (l.tailShift = this.currentMask.value.length - s.length)),
            o &&
              (l.tailShift += this.currentMask.append(o, {
                raw: !0,
                tail: !0,
              }).tailShift))
          : k && (this.currentMask.state = k)),
      l
    );
  }
  _appendPlaceholder() {
    const t = this._applyDispatch();
    return (
      this.currentMask && t.aggregate(this.currentMask._appendPlaceholder()), t
    );
  }
  _appendEager() {
    const t = this._applyDispatch();
    return this.currentMask && t.aggregate(this.currentMask._appendEager()), t;
  }
  appendTail(t) {
    const e = new f();
    return (
      t && e.aggregate(this._applyDispatch("", {}, t)),
      e.aggregate(
        this.currentMask ? this.currentMask.appendTail(t) : super.appendTail(t)
      )
    );
  }
  currentMaskFlags(t) {
    var e, i;
    return {
      ...t,
      _beforeTailState:
        (((e = t._beforeTailState) == null ? void 0 : e.currentMaskRef) ===
          this.currentMask &&
          ((i = t._beforeTailState) == null ? void 0 : i.currentMask)) ||
        t._beforeTailState,
    };
  }
  doDispatch(t, e, i) {
    return (
      e === void 0 && (e = {}),
      i === void 0 && (i = ""),
      this.dispatch(t, this, e, i)
    );
  }
  doValidate(t) {
    return (
      super.doValidate(t) &&
      (!this.currentMask ||
        this.currentMask.doValidate(this.currentMaskFlags(t)))
    );
  }
  doPrepare(t, e) {
    e === void 0 && (e = {});
    let [i, s] = super.doPrepare(t, e);
    if (this.currentMask) {
      let a;
      ([i, a] = super.doPrepare(i, this.currentMaskFlags(e))),
        (s = s.aggregate(a));
    }
    return [i, s];
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    let [i, s] = super.doPrepareChar(t, e);
    if (this.currentMask) {
      let a;
      ([i, a] = super.doPrepareChar(i, this.currentMaskFlags(e))),
        (s = s.aggregate(a));
    }
    return [i, s];
  }
  reset() {
    var t;
    (t = this.currentMask) == null || t.reset(),
      this.compiledMasks.forEach((e) => e.reset());
  }
  get value() {
    return this.exposeMask
      ? this.exposeMask.value
      : this.currentMask
        ? this.currentMask.value
        : "";
  }
  set value(t) {
    this.exposeMask
      ? ((this.exposeMask.value = t),
        (this.currentMask = this.exposeMask),
        this._applyDispatch())
      : (super.value = t);
  }
  get unmaskedValue() {
    return this.exposeMask
      ? this.exposeMask.unmaskedValue
      : this.currentMask
        ? this.currentMask.unmaskedValue
        : "";
  }
  set unmaskedValue(t) {
    this.exposeMask
      ? ((this.exposeMask.unmaskedValue = t),
        (this.currentMask = this.exposeMask),
        this._applyDispatch())
      : (super.unmaskedValue = t);
  }
  get typedValue() {
    return this.exposeMask
      ? this.exposeMask.typedValue
      : this.currentMask
        ? this.currentMask.typedValue
        : "";
  }
  set typedValue(t) {
    if (this.exposeMask) {
      (this.exposeMask.typedValue = t),
        (this.currentMask = this.exposeMask),
        this._applyDispatch();
      return;
    }
    let e = String(t);
    this.currentMask &&
      ((this.currentMask.typedValue = t), (e = this.currentMask.unmaskedValue)),
      (this.unmaskedValue = e);
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var t;
    return !!((t = this.currentMask) != null && t.isComplete);
  }
  get isFilled() {
    var t;
    return !!((t = this.currentMask) != null && t.isFilled);
  }
  remove(t, e) {
    const i = new f();
    return (
      this.currentMask &&
        i
          .aggregate(this.currentMask.remove(t, e))
          .aggregate(this._applyDispatch()),
      i
    );
  }
  get state() {
    var t;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((e) => e.state),
      currentMaskRef: this.currentMask,
      currentMask: (t = this.currentMask) == null ? void 0 : t.state,
    };
  }
  set state(t) {
    const { compiledMasks: e, currentMaskRef: i, currentMask: s, ...a } = t;
    e && this.compiledMasks.forEach((n, o) => (n.state = e[o])),
      i != null && ((this.currentMask = i), (this.currentMask.state = s)),
      (super.state = a);
  }
  extractInput(t, e, i) {
    return this.currentMask ? this.currentMask.extractInput(t, e, i) : "";
  }
  extractTail(t, e) {
    return this.currentMask
      ? this.currentMask.extractTail(t, e)
      : super.extractTail(t, e);
  }
  doCommit() {
    this.currentMask && this.currentMask.doCommit(), super.doCommit();
  }
  nearestInputPos(t, e) {
    return this.currentMask
      ? this.currentMask.nearestInputPos(t, e)
      : super.nearestInputPos(t, e);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(t) {
    this._overwrite = t;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(t) {
    this._eager = t;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(t) {
    this._skipInvalid = t;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(t) {
    this._autofix = t;
  }
  maskEquals(t) {
    return Array.isArray(t)
      ? this.compiledMasks.every((e, i) => {
          if (!t[i]) return;
          const { mask: s, ...a } = t[i];
          return Y(e, a) && e.maskEquals(s);
        })
      : super.maskEquals(t);
  }
  typedValueEquals(t) {
    var e;
    return !!((e = this.currentMask) != null && e.typedValueEquals(t));
  }
}
Q.DEFAULTS = {
  ...C.DEFAULTS,
  dispatch: (r, t, e, i) => {
    if (!t.compiledMasks.length) return;
    const s = t.rawInputValue,
      a = t.compiledMasks.map((n, o) => {
        const u = t.currentMask === n,
          l = u
            ? n.displayValue.length
            : n.nearestInputPos(n.displayValue.length, h.FORCE_LEFT);
        return (
          n.rawInputValue !== s
            ? (n.reset(), n.append(s, { raw: !0 }))
            : u || n.remove(l),
          n.append(r, t.currentMaskFlags(e)),
          n.appendTail(i),
          {
            index: o,
            weight: n.rawInputValue.length,
            totalInputPositions: n.totalInputPositions(
              0,
              Math.max(
                l,
                n.nearestInputPos(n.displayValue.length, h.FORCE_LEFT)
              )
            ),
          }
        );
      });
    return (
      a.sort(
        (n, o) =>
          o.weight - n.weight || o.totalInputPositions - n.totalInputPositions
      ),
      t.compiledMasks[a[0].index]
    );
  },
};
d.MaskedDynamic = Q;
class J extends w {
  constructor(t) {
    super({ ...J.DEFAULTS, ...t });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    const { enum: e, ...i } = t;
    if (e) {
      const s = e.map((o) => o.length),
        a = Math.min(...s),
        n = Math.max(...s) - a;
      (i.mask = "*".repeat(a)),
        n && (i.mask += "[" + "*".repeat(n) + "]"),
        (this.enum = e);
    }
    super._update(i);
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = Math.min(
        this.nearestInputPos(0, h.FORCE_RIGHT),
        this.value.length
      ),
      s = this.enum.filter((a) =>
        this.matchValue(a, this.unmaskedValue + t, i)
      );
    if (s.length) {
      s.length === 1 &&
        this._forEachBlocksInRange(0, this.value.length, (n, o) => {
          const u = s[0][o];
          o >= this.value.length ||
            u === n.value ||
            (n.reset(), n._appendChar(u, e));
        });
      const a = super._appendCharRaw(s[0][this.value.length], e);
      return (
        s.length === 1 &&
          s[0]
            .slice(this.unmaskedValue.length)
            .split("")
            .forEach((n) => a.aggregate(super._appendCharRaw(n))),
        a
      );
    }
    return new f({ skip: !this.isComplete });
  }
  extractTail(t, e) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      new M("", t)
    );
  }
  remove(t, e) {
    if (
      (t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      t === e)
    )
      return new f();
    const i = Math.min(
      super.nearestInputPos(0, h.FORCE_RIGHT),
      this.value.length
    );
    let s;
    for (
      s = t;
      s >= 0 &&
      !(
        this.enum.filter((o) => this.matchValue(o, this.value.slice(i, s), i))
          .length > 1
      );
      --s
    );
    const a = super.remove(s, e);
    return (a.tailShift += s - t), a;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
J.DEFAULTS = { ...w.DEFAULTS, matchValue: (r, t, e) => r.indexOf(t, e) === e };
d.MaskedEnum = J;
class Wt extends C {
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update({ ...t, validate: t.mask });
  }
}
d.MaskedFunction = Wt;
var At;
class F extends C {
  constructor(t) {
    super({ ...F.DEFAULTS, ...t });
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    super._update(t), this._updateRegExps();
  }
  _updateRegExps() {
    const t = "^" + (this.allowNegative ? "[+|\\-]?" : ""),
      e = "\\d*",
      i =
        (this.scale
          ? "(" + rt(this.radix) + "\\d{0," + this.scale + "})?"
          : "") + "$";
    (this._numberRegExp = new RegExp(t + e + i)),
      (this._mapToRadixRegExp = new RegExp(
        "[" + this.mapToRadix.map(rt).join("") + "]",
        "g"
      )),
      (this._thousandsSeparatorRegExp = new RegExp(
        rt(this.thousandsSeparator),
        "g"
      ));
  }
  _removeThousandsSeparators(t) {
    return t.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(t) {
    const e = t.split(this.radix);
    return (
      (e[0] = e[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator)),
      e.join(this.radix)
    );
  }
  doPrepareChar(t, e) {
    e === void 0 && (e = {});
    const [i, s] = super.doPrepareChar(
      this._removeThousandsSeparators(
        this.scale &&
          this.mapToRadix.length &&
          ((e.input && e.raw) || (!e.input && !e.raw))
          ? t.replace(this._mapToRadixRegExp, this.radix)
          : t
      ),
      e
    );
    return (
      t && !i && (s.skip = !0),
      i &&
        !this.allowPositive &&
        !this.value &&
        i !== "-" &&
        s.aggregate(this._appendChar("-")),
      [i, s]
    );
  }
  _separatorsCount(t, e) {
    e === void 0 && (e = !1);
    let i = 0;
    for (let s = 0; s < t; ++s)
      this._value.indexOf(this.thousandsSeparator, s) === s &&
        (++i, e && (t += this.thousandsSeparator.length));
    return i;
  }
  _separatorsCountFromSlice(t) {
    return (
      t === void 0 && (t = this._value),
      this._separatorsCount(this._removeThousandsSeparators(t).length, !0)
    );
  }
  extractInput(t, e, i) {
    return (
      t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      ([t, e] = this._adjustRangeWithSeparators(t, e)),
      this._removeThousandsSeparators(super.extractInput(t, e, i))
    );
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i =
        e.tail && e._beforeTailState ? e._beforeTailState._value : this._value,
      s = this._separatorsCountFromSlice(i);
    this._value = this._removeThousandsSeparators(this.value);
    const a = this._value;
    this._value += t;
    const n = this.number;
    let o = !isNaN(n),
      u = !1;
    if (o) {
      let _;
      this.min != null &&
        this.min < 0 &&
        this.number < this.min &&
        (_ = this.min),
        this.max != null &&
          this.max > 0 &&
          this.number > this.max &&
          (_ = this.max),
        _ != null &&
          (this.autofix
            ? ((this._value = this.format(_, this).replace(
                F.UNMASKED_RADIX,
                this.radix
              )),
              u || (u = a === this._value && !e.tail))
            : (o = !1)),
        o && (o = !!this._value.match(this._numberRegExp));
    }
    let l;
    o
      ? (l = new f({
          inserted: this._value.slice(a.length),
          rawInserted: u ? "" : t,
          skip: u,
        }))
      : ((this._value = a), (l = new f())),
      (this._value = this._insertThousandsSeparators(this._value));
    const k =
        e.tail && e._beforeTailState ? e._beforeTailState._value : this._value,
      y = this._separatorsCountFromSlice(k);
    return (l.tailShift += (y - s) * this.thousandsSeparator.length), l;
  }
  _findSeparatorAround(t) {
    if (this.thousandsSeparator) {
      const e = t - this.thousandsSeparator.length + 1,
        i = this.value.indexOf(this.thousandsSeparator, e);
      if (i <= t) return i;
    }
    return -1;
  }
  _adjustRangeWithSeparators(t, e) {
    const i = this._findSeparatorAround(t);
    i >= 0 && (t = i);
    const s = this._findSeparatorAround(e);
    return s >= 0 && (e = s + this.thousandsSeparator.length), [t, e];
  }
  remove(t, e) {
    t === void 0 && (t = 0),
      e === void 0 && (e = this.displayValue.length),
      ([t, e] = this._adjustRangeWithSeparators(t, e));
    const i = this.value.slice(0, t),
      s = this.value.slice(e),
      a = this._separatorsCount(i.length);
    this._value = this._insertThousandsSeparators(
      this._removeThousandsSeparators(i + s)
    );
    const n = this._separatorsCountFromSlice(i);
    return new f({ tailShift: (n - a) * this.thousandsSeparator.length });
  }
  nearestInputPos(t, e) {
    if (!this.thousandsSeparator) return t;
    switch (e) {
      case h.NONE:
      case h.LEFT:
      case h.FORCE_LEFT: {
        const i = this._findSeparatorAround(t - 1);
        if (i >= 0) {
          const s = i + this.thousandsSeparator.length;
          if (t < s || this.value.length <= s || e === h.FORCE_LEFT) return i;
        }
        break;
      }
      case h.RIGHT:
      case h.FORCE_RIGHT: {
        const i = this._findSeparatorAround(t);
        if (i >= 0) return i + this.thousandsSeparator.length;
      }
    }
    return t;
  }
  doCommit() {
    if (this.value) {
      const t = this.number;
      let e = t;
      this.min != null && (e = Math.max(e, this.min)),
        this.max != null && (e = Math.min(e, this.max)),
        e !== t && (this.unmaskedValue = this.format(e, this));
      let i = this.value;
      this.normalizeZeros && (i = this._normalizeZeros(i)),
        this.padFractionalZeros &&
          this.scale > 0 &&
          (i = this._padFractionalZeros(i)),
        (this._value = i);
    }
    super.doCommit();
  }
  _normalizeZeros(t) {
    const e = this._removeThousandsSeparators(t).split(this.radix);
    return (
      (e[0] = e[0].replace(/^(\D*)(0*)(\d*)/, (i, s, a, n) => s + n)),
      t.length && !/\d$/.test(e[0]) && (e[0] = e[0] + "0"),
      e.length > 1 &&
        ((e[1] = e[1].replace(/0*$/, "")), e[1].length || (e.length = 1)),
      this._insertThousandsSeparators(e.join(this.radix))
    );
  }
  _padFractionalZeros(t) {
    if (!t) return t;
    const e = t.split(this.radix);
    return (
      e.length < 2 && e.push(""),
      (e[1] = e[1].padEnd(this.scale, "0")),
      e.join(this.radix)
    );
  }
  doSkipInvalid(t, e, i) {
    e === void 0 && (e = {});
    const s =
      this.scale === 0 &&
      t !== this.thousandsSeparator &&
      (t === this.radix ||
        t === F.UNMASKED_RADIX ||
        this.mapToRadix.includes(t));
    return super.doSkipInvalid(t, e, i) && !s;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(
      this._normalizeZeros(this.value)
    ).replace(this.radix, F.UNMASKED_RADIX);
  }
  set unmaskedValue(t) {
    super.unmaskedValue = t;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(t) {
    this.rawInputValue = this.format(t, this).replace(
      F.UNMASKED_RADIX,
      this.radix
    );
  }
  get number() {
    return this.typedValue;
  }
  set number(t) {
    this.typedValue = t;
  }
  get allowNegative() {
    return (
      (this.min != null && this.min < 0) || (this.max != null && this.max < 0)
    );
  }
  get allowPositive() {
    return (
      (this.min != null && this.min > 0) || (this.max != null && this.max > 0)
    );
  }
  typedValueEquals(t) {
    return (
      (super.typedValueEquals(t) ||
        (F.EMPTY_VALUES.includes(t) &&
          F.EMPTY_VALUES.includes(this.typedValue))) &&
      !(t === 0 && this.value === "")
    );
  }
}
At = F;
F.UNMASKED_RADIX = ".";
F.EMPTY_VALUES = [...C.EMPTY_VALUES, 0];
F.DEFAULTS = {
  ...C.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [At.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: !0,
  padFractionalZeros: !1,
  parse: Number,
  format: (r) =>
    r.toLocaleString("en-US", { useGrouping: !1, maximumFractionDigits: 20 }),
};
d.MaskedNumber = F;
const ct = { MASKED: "value", UNMASKED: "unmaskedValue", TYPED: "typedValue" };
function Ft(r, t, e) {
  t === void 0 && (t = ct.MASKED), e === void 0 && (e = ct.MASKED);
  const i = L(r);
  return (s) => i.runIsolated((a) => ((a[t] = s), a[e]));
}
function Kt(r, t, e, i) {
  return Ft(t, e, i)(r);
}
d.PIPE_TYPE = ct;
d.createPipe = Ft;
d.pipe = Kt;
class Gt extends w {
  get repeatFrom() {
    var t;
    return (t = Array.isArray(this.repeat)
      ? this.repeat[0]
      : this.repeat === 1 / 0
        ? 0
        : this.repeat) != null
      ? t
      : 0;
  }
  get repeatTo() {
    var t;
    return (t = Array.isArray(this.repeat) ? this.repeat[1] : this.repeat) !=
      null
      ? t
      : 1 / 0;
  }
  constructor(t) {
    super(t);
  }
  updateOptions(t) {
    super.updateOptions(t);
  }
  _update(t) {
    var e, i, s;
    const { repeat: a, ...n } = H(t);
    this._blockOpts = Object.assign({}, this._blockOpts, n);
    const o = L(this._blockOpts);
    (this.repeat =
      (e = (i = a ?? o.repeat) != null ? i : this.repeat) != null ? e : 1 / 0),
      super._update({
        mask: "m".repeat(
          Math.max(
            (this.repeatTo === 1 / 0 &&
              ((s = this._blocks) == null ? void 0 : s.length)) ||
              0,
            this.repeatFrom
          )
        ),
        blocks: { m: o },
        eager: o.eager,
        overwrite: o.overwrite,
        skipInvalid: o.skipInvalid,
        lazy: o.lazy,
        placeholderChar: o.placeholderChar,
        displayChar: o.displayChar,
      });
  }
  _allocateBlock(t) {
    if (t < this._blocks.length) return this._blocks[t];
    if (this.repeatTo === 1 / 0 || this._blocks.length < this.repeatTo)
      return (
        this._blocks.push(L(this._blockOpts)),
        (this.mask += "m"),
        this._blocks[this._blocks.length - 1]
      );
  }
  _appendCharRaw(t, e) {
    e === void 0 && (e = {});
    const i = new f();
    for (
      let u =
          (s =
            (a = this._mapPosToBlock(this.displayValue.length)) == null
              ? void 0
              : a.index) != null
            ? s
            : Math.max(this._blocks.length - 1, 0),
        l,
        k;
      (l =
        (n = this._blocks[u]) != null ? n : (k = !k && this._allocateBlock(u)));
      ++u
    ) {
      var s, a, n, o;
      const y = l._appendChar(t, {
        ...e,
        _beforeTailState:
          (o = e._beforeTailState) == null || (o = o._blocks) == null
            ? void 0
            : o[u],
      });
      if (y.skip && k) {
        this._blocks.pop(), (this.mask = this.mask.slice(1));
        break;
      }
      if ((i.aggregate(y), y.consumed)) break;
    }
    return i;
  }
  _trimEmptyTail(t, e) {
    var i, s;
    t === void 0 && (t = 0);
    const a = Math.max(
      ((i = this._mapPosToBlock(t)) == null ? void 0 : i.index) || 0,
      this.repeatFrom,
      0
    );
    let n;
    e != null && (n = (s = this._mapPosToBlock(e)) == null ? void 0 : s.index),
      n == null && (n = this._blocks.length - 1);
    let o = 0;
    for (let u = n; a <= u && !this._blocks[u].unmaskedValue; --u, ++o);
    o && (this._blocks.splice(n - o + 1, o), (this.mask = this.mask.slice(o)));
  }
  reset() {
    super.reset(), this._trimEmptyTail();
  }
  remove(t, e) {
    t === void 0 && (t = 0), e === void 0 && (e = this.displayValue.length);
    const i = super.remove(t, e);
    return this._trimEmptyTail(t, e), i;
  }
  totalInputPositions(t, e) {
    return (
      t === void 0 && (t = 0),
      e == null && this.repeatTo === 1 / 0
        ? 1 / 0
        : super.totalInputPositions(t, e)
    );
  }
  get state() {
    return super.state;
  }
  set state(t) {
    (this._blocks.length = t._blocks.length),
      (this.mask = this.mask.slice(0, this._blocks.length)),
      (super.state = t);
  }
}
d.RepeatBlock = Gt;
try {
  globalThis.IMask = d;
} catch {}
function Yt(r, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(r, i.key, i);
  }
}
function W(r) {
  return (
    (function (t) {
      if (Array.isArray(t)) return ot(t);
    })(r) ||
    (function (t) {
      if (typeof Symbol < "u" && Symbol.iterator in Object(t))
        return Array.from(t);
    })(r) ||
    (function (t, e) {
      if (t) {
        if (typeof t == "string") return ot(t, e);
        var i = Object.prototype.toString.call(t).slice(8, -1);
        if (
          (i === "Object" && t.constructor && (i = t.constructor.name),
          i === "Map" || i === "Set")
        )
          return Array.from(t);
        if (
          i === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)
        )
          return ot(t, e);
      }
    })(r) ||
    (function () {
      throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    })()
  );
}
function ot(r, t) {
  (t == null || t > r.length) && (t = r.length);
  for (var e = 0, i = new Array(t); e < t; e++) i[e] = r[e];
  return i;
}
var yt,
  ut,
  U,
  lt,
  xt,
  $t =
    ((yt = [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "button:not([disabled]):not([aria-hidden])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])',
    ]),
    (ut = (function () {
      function r(i) {
        var s = i.targetModal,
          a = i.triggers,
          n = a === void 0 ? [] : a,
          o = i.onShow,
          u = o === void 0 ? function () {} : o,
          l = i.onClose,
          k = l === void 0 ? function () {} : l,
          y = i.openTrigger,
          _ = y === void 0 ? "data-micromodal-trigger" : y,
          T = i.closeTrigger,
          R = T === void 0 ? "data-micromodal-close" : T,
          I = i.openClass,
          V = I === void 0 ? "is-open" : I,
          p = i.disableScroll,
          m = p !== void 0 && p,
          g = i.disableFocus,
          O = g !== void 0 && g,
          D = i.awaitCloseAnimation,
          A = D !== void 0 && D,
          b = i.awaitOpenAnimation,
          c = b !== void 0 && b,
          E = i.debugMode,
          x = E !== void 0 && E;
        (function (q, P) {
          if (!(q instanceof P))
            throw new TypeError("Cannot call a class as a function");
        })(this, r),
          (this.modal = document.getElementById(s)),
          (this.config = {
            debugMode: x,
            disableScroll: m,
            openTrigger: _,
            closeTrigger: R,
            openClass: V,
            onShow: u,
            onClose: k,
            awaitCloseAnimation: A,
            awaitOpenAnimation: c,
            disableFocus: O,
          }),
          n.length > 0 && this.registerTriggers.apply(this, W(n)),
          (this.onClick = this.onClick.bind(this)),
          (this.onKeydown = this.onKeydown.bind(this));
      }
      var t, e;
      return (
        (t = r),
        (e = [
          {
            key: "registerTriggers",
            value: function () {
              for (
                var i = this, s = arguments.length, a = new Array(s), n = 0;
                n < s;
                n++
              )
                a[n] = arguments[n];
              a.filter(Boolean).forEach(function (o) {
                o.addEventListener("click", function (u) {
                  return i.showModal(u);
                });
              });
            },
          },
          {
            key: "showModal",
            value: function () {
              var i = this,
                s =
                  arguments.length > 0 && arguments[0] !== void 0
                    ? arguments[0]
                    : null;
              if (
                ((this.activeElement = document.activeElement),
                this.modal.setAttribute("aria-hidden", "false"),
                this.modal.classList.add(this.config.openClass),
                this.scrollBehaviour("disable"),
                this.addEventListeners(),
                this.config.awaitOpenAnimation)
              ) {
                var a = function n() {
                  i.modal.removeEventListener("animationend", n, !1),
                    i.setFocusToFirstNode();
                };
                this.modal.addEventListener("animationend", a, !1);
              } else this.setFocusToFirstNode();
              this.config.onShow(this.modal, this.activeElement, s);
            },
          },
          {
            key: "closeModal",
            value: function () {
              var i =
                  arguments.length > 0 && arguments[0] !== void 0
                    ? arguments[0]
                    : null,
                s = this.modal;
              if (
                (this.modal.setAttribute("aria-hidden", "true"),
                this.removeEventListeners(),
                this.scrollBehaviour("enable"),
                this.activeElement &&
                  this.activeElement.focus &&
                  this.activeElement.focus(),
                this.config.onClose(this.modal, this.activeElement, i),
                this.config.awaitCloseAnimation)
              ) {
                var a = this.config.openClass;
                this.modal.addEventListener(
                  "animationend",
                  function n() {
                    s.classList.remove(a),
                      s.removeEventListener("animationend", n, !1);
                  },
                  !1
                );
              } else s.classList.remove(this.config.openClass);
            },
          },
          {
            key: "closeModalById",
            value: function (i) {
              (this.modal = document.getElementById(i)),
                this.modal && this.closeModal();
            },
          },
          {
            key: "scrollBehaviour",
            value: function (i) {
              if (this.config.disableScroll) {
                var s = document.querySelector("body");
                switch (i) {
                  case "enable":
                    Object.assign(s.style, { overflow: "" });
                    break;
                  case "disable":
                    Object.assign(s.style, { overflow: "hidden" });
                }
              }
            },
          },
          {
            key: "addEventListeners",
            value: function () {
              this.modal.addEventListener("touchstart", this.onClick),
                this.modal.addEventListener("click", this.onClick),
                document.addEventListener("keydown", this.onKeydown);
            },
          },
          {
            key: "removeEventListeners",
            value: function () {
              this.modal.removeEventListener("touchstart", this.onClick),
                this.modal.removeEventListener("click", this.onClick),
                document.removeEventListener("keydown", this.onKeydown);
            },
          },
          {
            key: "onClick",
            value: function (i) {
              (i.target.hasAttribute(this.config.closeTrigger) ||
                i.target.parentNode.hasAttribute(this.config.closeTrigger)) &&
                (i.preventDefault(), i.stopPropagation(), this.closeModal(i));
            },
          },
          {
            key: "onKeydown",
            value: function (i) {
              i.keyCode === 27 && this.closeModal(i),
                i.keyCode === 9 && this.retainFocus(i);
            },
          },
          {
            key: "getFocusableNodes",
            value: function () {
              var i = this.modal.querySelectorAll(yt);
              return Array.apply(void 0, W(i));
            },
          },
          {
            key: "setFocusToFirstNode",
            value: function () {
              var i = this;
              if (!this.config.disableFocus) {
                var s = this.getFocusableNodes();
                if (s.length !== 0) {
                  var a = s.filter(function (n) {
                    return !n.hasAttribute(i.config.closeTrigger);
                  });
                  a.length > 0 && a[0].focus(), a.length === 0 && s[0].focus();
                }
              }
            },
          },
          {
            key: "retainFocus",
            value: function (i) {
              var s = this.getFocusableNodes();
              if (s.length !== 0)
                if (
                  ((s = s.filter(function (n) {
                    return n.offsetParent !== null;
                  })),
                  this.modal.contains(document.activeElement))
                ) {
                  var a = s.indexOf(document.activeElement);
                  i.shiftKey &&
                    a === 0 &&
                    (s[s.length - 1].focus(), i.preventDefault()),
                    !i.shiftKey &&
                      s.length > 0 &&
                      a === s.length - 1 &&
                      (s[0].focus(), i.preventDefault());
                } else s[0].focus();
            },
          },
        ]) && Yt(t.prototype, e),
        r
      );
    })()),
    (U = null),
    (lt = function (r) {
      if (!document.getElementById(r))
        return (
          console.warn(
            "MicroModal: ❗Seems like you have missed %c'".concat(r, "'"),
            "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
            "ID somewhere in your code. Refer example below to resolve it."
          ),
          console.warn(
            "%cExample:",
            "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
            '<div class="modal" id="'.concat(r, '"></div>')
          ),
          !1
        );
    }),
    (xt = function (r, t) {
      if (
        ((function (i) {
          i.length <= 0 &&
            (console.warn(
              "MicroModal: ❗Please specify at least one %c'micromodal-trigger'",
              "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
              "data attribute."
            ),
            console.warn(
              "%cExample:",
              "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
              '<a href="#" data-micromodal-trigger="my-modal"></a>'
            ));
        })(r),
        !t)
      )
        return !0;
      for (var e in t) lt(e);
      return !0;
    }),
    {
      init: function (r) {
        var t = Object.assign(
            {},
            { openTrigger: "data-micromodal-trigger" },
            r
          ),
          e = W(document.querySelectorAll("[".concat(t.openTrigger, "]"))),
          i = (function (n, o) {
            var u = [];
            return (
              n.forEach(function (l) {
                var k = l.attributes[o].value;
                u[k] === void 0 && (u[k] = []), u[k].push(l);
              }),
              u
            );
          })(e, t.openTrigger);
        if (t.debugMode !== !0 || xt(e, i) !== !1)
          for (var s in i) {
            var a = i[s];
            (t.targetModal = s), (t.triggers = W(a)), (U = new ut(t));
          }
      },
      show: function (r, t) {
        var e = t || {};
        (e.targetModal = r),
          (e.debugMode === !0 && lt(r) === !1) ||
            (U && U.removeEventListeners(), (U = new ut(e)).showModal());
      },
      close: function (r) {
        r ? U.closeModalById(r) : U.closeModal();
      },
    });
typeof window < "u" && (window.MicroModal = $t);
var ht =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {},
  St = { exports: {} };
(function (r) {
  (function (t, e) {
    r.exports = e(t);
  })(typeof ht < "u" ? ht : typeof window < "u" ? window : ht, function (t) {
    if (typeof t > "u" && typeof t.document > "u") return !1;
    var e = "Notiflix",
      i = `

Visit documentation page to learn more: https://notiflix.github.io/documentation`,
      s =
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      a = {
        Success: "Success",
        Failure: "Failure",
        Warning: "Warning",
        Info: "Info",
      },
      n,
      o = {
        wrapID: "NotiflixNotifyWrap",
        overlayID: "NotiflixNotifyOverlay",
        width: "280px",
        position: "right-top",
        distance: "10px",
        opacity: 1,
        borderRadius: "5px",
        rtl: !1,
        timeout: 3e3,
        messageMaxLength: 110,
        backOverlay: !1,
        backOverlayColor: "rgba(0,0,0,0.5)",
        plainText: !0,
        showOnlyTheLastOne: !1,
        clickToClose: !1,
        pauseOnHover: !0,
        ID: "NotiflixNotify",
        className: "notiflix-notify",
        zindex: 4001,
        fontFamily: "Quicksand",
        fontSize: "13px",
        cssAnimation: !0,
        cssAnimationDuration: 400,
        cssAnimationStyle: "fade",
        closeButton: !1,
        useIcon: !0,
        useFontAwesome: !1,
        fontAwesomeIconStyle: "basic",
        fontAwesomeIconSize: "34px",
        success: {
          background: "#32c682",
          textColor: "#fff",
          childClassName: "notiflix-notify-success",
          notiflixIconColor: "rgba(0,0,0,0.2)",
          fontAwesomeClassName: "fas fa-check-circle",
          fontAwesomeIconColor: "rgba(0,0,0,0.2)",
          backOverlayColor: "rgba(50,198,130,0.2)",
        },
        failure: {
          background: "#ff5549",
          textColor: "#fff",
          childClassName: "notiflix-notify-failure",
          notiflixIconColor: "rgba(0,0,0,0.2)",
          fontAwesomeClassName: "fas fa-times-circle",
          fontAwesomeIconColor: "rgba(0,0,0,0.2)",
          backOverlayColor: "rgba(255,85,73,0.2)",
        },
        warning: {
          background: "#eebf31",
          textColor: "#fff",
          childClassName: "notiflix-notify-warning",
          notiflixIconColor: "rgba(0,0,0,0.2)",
          fontAwesomeClassName: "fas fa-exclamation-circle",
          fontAwesomeIconColor: "rgba(0,0,0,0.2)",
          backOverlayColor: "rgba(238,191,49,0.2)",
        },
        info: {
          background: "#26c0d3",
          textColor: "#fff",
          childClassName: "notiflix-notify-info",
          notiflixIconColor: "rgba(0,0,0,0.2)",
          fontAwesomeClassName: "fas fa-info-circle",
          fontAwesomeIconColor: "rgba(0,0,0,0.2)",
          backOverlayColor: "rgba(38,192,211,0.2)",
        },
      },
      u = function (p) {
        return console.error(
          "%c " + e + " Error ",
          "padding:2px;border-radius:20px;color:#fff;background:#ff5549",
          `
` +
            p +
            i
        );
      },
      l = function (p) {
        return (
          p || (p = "head"),
          t.document[p] === null
            ? (u(
                `
Notiflix needs to be appended to the "<` +
                  p +
                  '>" element, but you called it before the "<' +
                  p +
                  '>" element has been created.'
              ),
              !1)
            : !0
        );
      },
      k = function (p, m) {
        if (!l("head")) return !1;
        if (p() !== null && !t.document.getElementById(m)) {
          var g = t.document.createElement("style");
          (g.id = m), (g.innerHTML = p()), t.document.head.appendChild(g);
        }
      },
      y = function () {
        var p = {},
          m = !1,
          g = 0;
        Object.prototype.toString.call(arguments[0]) === "[object Boolean]" &&
          ((m = arguments[0]), g++);
        for (
          var O = function (D) {
            for (var A in D)
              Object.prototype.hasOwnProperty.call(D, A) &&
                (m && Object.prototype.toString.call(D[A]) === "[object Object]"
                  ? (p[A] = y(p[A], D[A]))
                  : (p[A] = D[A]));
          };
          g < arguments.length;
          g++
        )
          O(arguments[g]);
        return p;
      },
      _ = function (p) {
        var m = t.document.createElement("div");
        return (m.innerHTML = p), m.textContent || m.innerText || "";
      },
      T = function () {
        var p =
          '[id^=NotiflixNotifyWrap]{pointer-events:none;position:fixed;z-index:4001;opacity:1;right:10px;top:10px;width:280px;max-width:96%;-webkit-box-sizing:border-box;box-sizing:border-box;background:transparent}[id^=NotiflixNotifyWrap].nx-flex-center-center{max-height:calc(100vh - 20px);overflow-x:hidden;overflow-y:auto;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;margin:auto}[id^=NotiflixNotifyWrap]::-webkit-scrollbar{width:0;height:0}[id^=NotiflixNotifyWrap]::-webkit-scrollbar-thumb{background:transparent}[id^=NotiflixNotifyWrap]::-webkit-scrollbar-track{background:transparent}[id^=NotiflixNotifyWrap] *{-webkit-box-sizing:border-box;box-sizing:border-box}[id^=NotiflixNotifyOverlay]{-webkit-transition:background .3s ease-in-out;-o-transition:background .3s ease-in-out;transition:background .3s ease-in-out}[id^=NotiflixNotifyWrap]>div{pointer-events:all;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:"Quicksand",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;width:100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:relative;margin:0 0 10px;border-radius:5px;background:#1e1e1e;color:#fff;padding:10px 12px;font-size:14px;line-height:1.4}[id^=NotiflixNotifyWrap]>div:last-child{margin:0}[id^=NotiflixNotifyWrap]>div.nx-with-callback{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-icon{padding:8px;min-height:56px}[id^=NotiflixNotifyWrap]>div.nx-paused{cursor:auto}[id^=NotiflixNotifyWrap]>div.nx-notify-click-to-close{cursor:pointer}[id^=NotiflixNotifyWrap]>div.nx-with-close-button{padding:10px 36px 10px 12px}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button{padding:6px 36px 6px 6px}[id^=NotiflixNotifyWrap]>div>span.nx-message{cursor:inherit;font-weight:normal;font-family:inherit!important;word-break:break-all;word-break:break-word}[id^=NotiflixNotifyWrap]>div>span.nx-close-button{cursor:pointer;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;position:absolute;right:8px;top:0;bottom:0;margin:auto;color:inherit;width:20px;height:20px}[id^=NotiflixNotifyWrap]>div>span.nx-close-button:hover{-webkit-transform:rotate(90deg);transform:rotate(90deg)}[id^=NotiflixNotifyWrap]>div>span.nx-close-button>svg{position:absolute;width:16px;height:16px;right:2px;top:2px}[id^=NotiflixNotifyWrap]>div>.nx-message-icon{position:absolute;width:40px;height:40px;font-size:30px;line-height:40px;text-align:center;left:8px;top:0;bottom:0;margin:auto;border-radius:inherit}[id^=NotiflixNotifyWrap]>div>.nx-message-icon-fa.nx-message-icon-fa-shadow{color:inherit;background:rgba(0,0,0,.15);-webkit-box-shadow:inset 0 0 34px rgba(0,0,0,.2);box-shadow:inset 0 0 34px rgba(0,0,0,.2);text-shadow:0 0 10px rgba(0,0,0,.3)}[id^=NotiflixNotifyWrap]>div>span.nx-with-icon{position:relative;float:left;width:calc(100% - 40px);margin:0 0 0 40px;padding:0 0 0 10px;-webkit-box-sizing:border-box;box-sizing:border-box}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>.nx-message-icon{left:auto;right:8px}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-with-icon{padding:0 10px 0 0;margin:0 40px 0 0}[id^=NotiflixNotifyWrap]>div.nx-rtl-on>span.nx-close-button{right:auto;left:8px}[id^=NotiflixNotifyWrap]>div.nx-with-icon.nx-with-close-button.nx-rtl-on{padding:6px 6px 6px 36px}[id^=NotiflixNotifyWrap]>div.nx-with-close-button.nx-rtl-on{padding:10px 12px 10px 36px}[id^=NotiflixNotifyOverlay].nx-with-animation,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade{-webkit-animation:notify-animation-fade .3s ease-in-out 0s normal;animation:notify-animation-fade .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-fade{0%{opacity:0}100%{opacity:1}}@keyframes notify-animation-fade{0%{opacity:0}100%{opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom{-webkit-animation:notify-animation-zoom .3s ease-in-out 0s normal;animation:notify-animation-zoom .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-zoom{0%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes notify-animation-zoom{0%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(1);transform:scale(1)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right{-webkit-animation:notify-animation-from-right .3s ease-in-out 0s normal;animation:notify-animation-from-right .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-right{0%{right:-300px;opacity:0}50%{right:8px;opacity:1}100%{right:0;opacity:1}}@keyframes notify-animation-from-right{0%{right:-300px;opacity:0}50%{right:8px;opacity:1}100%{right:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left{-webkit-animation:notify-animation-from-left .3s ease-in-out 0s normal;animation:notify-animation-from-left .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-left{0%{left:-300px;opacity:0}50%{left:8px;opacity:1}100%{left:0;opacity:1}}@keyframes notify-animation-from-left{0%{left:-300px;opacity:0}50%{left:8px;opacity:1}100%{left:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top{-webkit-animation:notify-animation-from-top .3s ease-in-out 0s normal;animation:notify-animation-from-top .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-top{0%{top:-50px;opacity:0}50%{top:8px;opacity:1}100%{top:0;opacity:1}}@keyframes notify-animation-from-top{0%{top:-50px;opacity:0}50%{top:8px;opacity:1}100%{top:0;opacity:1}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom{-webkit-animation:notify-animation-from-bottom .3s ease-in-out 0s normal;animation:notify-animation-from-bottom .3s ease-in-out 0s normal}@-webkit-keyframes notify-animation-from-bottom{0%{bottom:-50px;opacity:0}50%{bottom:8px;opacity:1}100%{bottom:0;opacity:1}}@keyframes notify-animation-from-bottom{0%{bottom:-50px;opacity:0}50%{bottom:8px;opacity:1}100%{bottom:0;opacity:1}}[id^=NotiflixNotifyOverlay].nx-with-animation.nx-remove,[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-fade.nx-remove{opacity:0;-webkit-animation:notify-remove-fade .3s ease-in-out 0s normal;animation:notify-remove-fade .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-fade{0%{opacity:1}100%{opacity:0}}@keyframes notify-remove-fade{0%{opacity:1}100%{opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-zoom.nx-remove{-webkit-transform:scale(0);transform:scale(0);-webkit-animation:notify-remove-zoom .3s ease-in-out 0s normal;animation:notify-remove-zoom .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-zoom{0%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(0);transform:scale(0)}}@keyframes notify-remove-zoom{0%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.05);transform:scale(1.05)}100%{-webkit-transform:scale(0);transform:scale(0)}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-top.nx-remove{opacity:0;-webkit-animation:notify-remove-to-top .3s ease-in-out 0s normal;animation:notify-remove-to-top .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-top{0%{top:0;opacity:1}50%{top:8px;opacity:1}100%{top:-50px;opacity:0}}@keyframes notify-remove-to-top{0%{top:0;opacity:1}50%{top:8px;opacity:1}100%{top:-50px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-right.nx-remove{opacity:0;-webkit-animation:notify-remove-to-right .3s ease-in-out 0s normal;animation:notify-remove-to-right .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-right{0%{right:0;opacity:1}50%{right:8px;opacity:1}100%{right:-300px;opacity:0}}@keyframes notify-remove-to-right{0%{right:0;opacity:1}50%{right:8px;opacity:1}100%{right:-300px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-bottom.nx-remove{opacity:0;-webkit-animation:notify-remove-to-bottom .3s ease-in-out 0s normal;animation:notify-remove-to-bottom .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-bottom{0%{bottom:0;opacity:1}50%{bottom:8px;opacity:1}100%{bottom:-50px;opacity:0}}@keyframes notify-remove-to-bottom{0%{bottom:0;opacity:1}50%{bottom:8px;opacity:1}100%{bottom:-50px;opacity:0}}[id^=NotiflixNotifyWrap]>div.nx-with-animation.nx-from-left.nx-remove{opacity:0;-webkit-animation:notify-remove-to-left .3s ease-in-out 0s normal;animation:notify-remove-to-left .3s ease-in-out 0s normal}@-webkit-keyframes notify-remove-to-left{0%{left:0;opacity:1}50%{left:8px;opacity:1}100%{left:-300px;opacity:0}}@keyframes notify-remove-to-left{0%{left:0;opacity:1}50%{left:8px;opacity:1}100%{left:-300px;opacity:0}}';
        return p || null;
      },
      R = 0,
      I = function (p, m, g, O) {
        if (!l("body")) return !1;
        n || V.Notify.init({});
        var D = y(!0, n, {});
        if (
          (typeof g == "object" && !Array.isArray(g)) ||
          (typeof O == "object" && !Array.isArray(O))
        ) {
          var A = {};
          typeof g == "object" ? (A = g) : typeof O == "object" && (A = O),
            (n = y(!0, n, A));
        }
        var b = n[p.toLocaleLowerCase("en")];
        R++,
          typeof m != "string" && (m = "Notiflix " + p),
          n.plainText && (m = _(m)),
          !n.plainText &&
            m.length > n.messageMaxLength &&
            ((n = y(!0, n, { closeButton: !0, messageMaxLength: 150 })),
            (m =
              'Possible HTML Tags Error: The "plainText" option is "false" and the notification content length is more than the "messageMaxLength" option.')),
          m.length > n.messageMaxLength &&
            (m = m.substring(0, n.messageMaxLength) + "..."),
          n.fontAwesomeIconStyle === "shadow" &&
            (b.fontAwesomeIconColor = b.background),
          n.cssAnimation || (n.cssAnimationDuration = 0);
        var c =
          t.document.getElementById(o.wrapID) ||
          t.document.createElement("div");
        if (
          ((c.id = o.wrapID),
          (c.style.width = n.width),
          (c.style.zIndex = n.zindex),
          (c.style.opacity = n.opacity),
          n.position === "center-center"
            ? ((c.style.left = n.distance),
              (c.style.top = n.distance),
              (c.style.right = n.distance),
              (c.style.bottom = n.distance),
              (c.style.margin = "auto"),
              c.classList.add("nx-flex-center-center"),
              (c.style.maxHeight =
                "calc((100vh - " + n.distance + ") - " + n.distance + ")"),
              (c.style.display = "flex"),
              (c.style.flexWrap = "wrap"),
              (c.style.flexDirection = "column"),
              (c.style.justifyContent = "center"),
              (c.style.alignItems = "center"),
              (c.style.pointerEvents = "none"))
            : n.position === "center-top"
              ? ((c.style.left = n.distance),
                (c.style.right = n.distance),
                (c.style.top = n.distance),
                (c.style.bottom = "auto"),
                (c.style.margin = "auto"))
              : n.position === "center-bottom"
                ? ((c.style.left = n.distance),
                  (c.style.right = n.distance),
                  (c.style.bottom = n.distance),
                  (c.style.top = "auto"),
                  (c.style.margin = "auto"))
                : n.position === "right-bottom"
                  ? ((c.style.right = n.distance),
                    (c.style.bottom = n.distance),
                    (c.style.top = "auto"),
                    (c.style.left = "auto"))
                  : n.position === "left-top"
                    ? ((c.style.left = n.distance),
                      (c.style.top = n.distance),
                      (c.style.right = "auto"),
                      (c.style.bottom = "auto"))
                    : n.position === "left-bottom"
                      ? ((c.style.left = n.distance),
                        (c.style.bottom = n.distance),
                        (c.style.top = "auto"),
                        (c.style.right = "auto"))
                      : ((c.style.right = n.distance),
                        (c.style.top = n.distance),
                        (c.style.left = "auto"),
                        (c.style.bottom = "auto")),
          n.backOverlay)
        ) {
          var E =
            t.document.getElementById(o.overlayID) ||
            t.document.createElement("div");
          (E.id = o.overlayID),
            (E.style.width = "100%"),
            (E.style.height = "100%"),
            (E.style.position = "fixed"),
            (E.style.zIndex = n.zindex - 1),
            (E.style.left = 0),
            (E.style.top = 0),
            (E.style.right = 0),
            (E.style.bottom = 0),
            (E.style.background = b.backOverlayColor || n.backOverlayColor),
            (E.className = n.cssAnimation ? "nx-with-animation" : ""),
            (E.style.animationDuration = n.cssAnimation
              ? n.cssAnimationDuration + "ms"
              : ""),
            t.document.getElementById(o.overlayID) ||
              t.document.body.appendChild(E);
        }
        t.document.getElementById(o.wrapID) || t.document.body.appendChild(c);
        var x = t.document.createElement("div");
        (x.id = n.ID + "-" + R),
          (x.className =
            n.className +
            " " +
            b.childClassName +
            " " +
            (n.cssAnimation ? "nx-with-animation" : "") +
            " " +
            (n.useIcon ? "nx-with-icon" : "") +
            " nx-" +
            n.cssAnimationStyle +
            " " +
            (n.closeButton && typeof g != "function"
              ? "nx-with-close-button"
              : "") +
            " " +
            (typeof g == "function" ? "nx-with-callback" : "") +
            " " +
            (n.clickToClose ? "nx-notify-click-to-close" : "")),
          (x.style.fontSize = n.fontSize),
          (x.style.color = b.textColor),
          (x.style.background = b.background),
          (x.style.borderRadius = n.borderRadius),
          (x.style.pointerEvents = "all"),
          n.rtl && (x.setAttribute("dir", "rtl"), x.classList.add("nx-rtl-on")),
          (x.style.fontFamily = '"' + n.fontFamily + '", ' + s),
          n.cssAnimation &&
            (x.style.animationDuration = n.cssAnimationDuration + "ms");
        var q = "";
        if (
          (n.closeButton &&
            typeof g != "function" &&
            (q =
              '<span class="nx-close-button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g><path fill="' +
              b.notiflixIconColor +
              '" d="M0.38 2.19l7.8 7.81 -7.8 7.81c-0.51,0.5 -0.51,1.31 -0.01,1.81 0.25,0.25 0.57,0.38 0.91,0.38 0.34,0 0.67,-0.14 0.91,-0.38l7.81 -7.81 7.81 7.81c0.24,0.24 0.57,0.38 0.91,0.38 0.34,0 0.66,-0.14 0.9,-0.38 0.51,-0.5 0.51,-1.31 0,-1.81l-7.81 -7.81 7.81 -7.81c0.51,-0.5 0.51,-1.31 0,-1.82 -0.5,-0.5 -1.31,-0.5 -1.81,0l-7.81 7.81 -7.81 -7.81c-0.5,-0.5 -1.31,-0.5 -1.81,0 -0.51,0.51 -0.51,1.32 0,1.82z"/></g></svg></span>'),
          n.useIcon)
        )
          if (n.useFontAwesome)
            x.innerHTML =
              '<i style="color:' +
              b.fontAwesomeIconColor +
              "; font-size:" +
              n.fontAwesomeIconSize +
              ';" class="nx-message-icon nx-message-icon-fa ' +
              b.fontAwesomeClassName +
              " " +
              (n.fontAwesomeIconStyle === "shadow"
                ? "nx-message-icon-fa-shadow"
                : "nx-message-icon-fa-basic") +
              '"></i><span class="nx-message nx-with-icon">' +
              m +
              "</span>" +
              (n.closeButton ? q : "");
          else {
            var P = "";
            p === a.Success
              ? (P =
                  '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' +
                  b.notiflixIconColor +
                  '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm-2.4 -13.29l11.52 -12.96c0.37,-0.41 1.01,-0.45 1.42,-0.08 0.42,0.37 0.46,1 0.09,1.42l-12.16 13.67c-0.19,0.22 -0.46,0.34 -0.75,0.34 -0.23,0 -0.45,-0.07 -0.63,-0.22l-7.6 -6.07c-0.43,-0.35 -0.5,-0.99 -0.16,-1.42 0.35,-0.43 0.99,-0.5 1.42,-0.16l6.85 5.48z"/></g></svg>')
              : p === a.Failure
                ? (P =
                    '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' +
                    b.notiflixIconColor +
                    '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm1.42 -17.98l6.13 6.12c0.39,0.4 0.39,1.04 0,1.43 -0.19,0.19 -0.45,0.29 -0.71,0.29 -0.27,0 -0.53,-0.1 -0.72,-0.29l-6.12 -6.13 -6.13 6.13c-0.19,0.19 -0.44,0.29 -0.71,0.29 -0.27,0 -0.52,-0.1 -0.71,-0.29 -0.39,-0.39 -0.39,-1.03 0,-1.43l6.13 -6.12 -6.13 -6.13c-0.39,-0.39 -0.39,-1.03 0,-1.42 0.39,-0.39 1.03,-0.39 1.42,0l6.13 6.12 6.12 -6.12c0.4,-0.39 1.04,-0.39 1.43,0 0.39,0.39 0.39,1.03 0,1.42l-6.13 6.13z"/></g></svg>')
                : p === a.Warning
                  ? (P =
                      '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' +
                      b.notiflixIconColor +
                      '" d="M21.91 3.48l17.8 30.89c0.84,1.46 -0.23,3.25 -1.91,3.25l-35.6 0c-1.68,0 -2.75,-1.79 -1.91,-3.25l17.8 -30.89c0.85,-1.47 2.97,-1.47 3.82,0zm16.15 31.84l-17.8 -30.89c-0.11,-0.2 -0.41,-0.2 -0.52,0l-17.8 30.89c-0.12,0.2 0.05,0.4 0.26,0.4l35.6 0c0.21,0 0.38,-0.2 0.26,-0.4zm-19.01 -4.12l0 -1.05c0,-0.53 0.42,-0.95 0.95,-0.95 0.53,0 0.95,0.42 0.95,0.95l0 1.05c0,0.53 -0.42,0.95 -0.95,0.95 -0.53,0 -0.95,-0.42 -0.95,-0.95zm0 -4.66l0 -13.39c0,-0.52 0.42,-0.95 0.95,-0.95 0.53,0 0.95,0.43 0.95,0.95l0 13.39c0,0.53 -0.42,0.96 -0.95,0.96 -0.53,0 -0.95,-0.43 -0.95,-0.96z"/></g></svg>')
                  : p === a.Info &&
                    (P =
                      '<svg class="nx-message-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g><path fill="' +
                      b.notiflixIconColor +
                      '" d="M20 0c11.03,0 20,8.97 20,20 0,11.03 -8.97,20 -20,20 -11.03,0 -20,-8.97 -20,-20 0,-11.03 8.97,-20 20,-20zm0 37.98c9.92,0 17.98,-8.06 17.98,-17.98 0,-9.92 -8.06,-17.98 -17.98,-17.98 -9.92,0 -17.98,8.06 -17.98,17.98 0,9.92 8.06,17.98 17.98,17.98zm-0.99 -23.3c0,-0.54 0.44,-0.98 0.99,-0.98 0.55,0 0.99,0.44 0.99,0.98l0 15.86c0,0.55 -0.44,0.99 -0.99,0.99 -0.55,0 -0.99,-0.44 -0.99,-0.99l0 -15.86zm0 -5.22c0,-0.55 0.44,-0.99 0.99,-0.99 0.55,0 0.99,0.44 0.99,0.99l0 1.09c0,0.54 -0.44,0.99 -0.99,0.99 -0.55,0 -0.99,-0.45 -0.99,-0.99l0 -1.09z"/></g></svg>'),
              (x.innerHTML =
                P +
                '<span class="nx-message nx-with-icon">' +
                m +
                "</span>" +
                (n.closeButton ? q : ""));
          }
        else
          x.innerHTML =
            '<span class="nx-message">' +
            m +
            "</span>" +
            (n.closeButton ? q : "");
        if (n.position === "left-bottom" || n.position === "right-bottom") {
          var ft = t.document.getElementById(o.wrapID);
          ft.insertBefore(x, ft.firstChild);
        } else t.document.getElementById(o.wrapID).appendChild(x);
        var S = t.document.getElementById(x.id);
        if (S) {
          var tt,
            et,
            it = function () {
              S.classList.add("nx-remove");
              var B = t.document.getElementById(o.overlayID);
              B && c.childElementCount <= 0 && B.classList.add("nx-remove"),
                clearTimeout(tt);
            },
            st = function () {
              if (
                (S && S.parentNode !== null && S.parentNode.removeChild(S),
                c.childElementCount <= 0 && c.parentNode !== null)
              ) {
                c.parentNode.removeChild(c);
                var B = t.document.getElementById(o.overlayID);
                B && B.parentNode !== null && B.parentNode.removeChild(B);
              }
              clearTimeout(et);
            };
          if (n.closeButton && typeof g != "function") {
            var Lt = t.document
              .getElementById(x.id)
              .querySelector("span.nx-close-button");
            Lt.addEventListener("click", function () {
              it();
              var B = setTimeout(function () {
                st(), clearTimeout(B);
              }, n.cssAnimationDuration);
            });
          }
          if (
            ((typeof g == "function" || n.clickToClose) &&
              S.addEventListener("click", function () {
                typeof g == "function" && g(), it();
                var B = setTimeout(function () {
                  st(), clearTimeout(B);
                }, n.cssAnimationDuration);
              }),
            !n.closeButton && typeof g != "function")
          ) {
            var mt = function () {
              (tt = setTimeout(function () {
                it();
              }, n.timeout)),
                (et = setTimeout(function () {
                  st();
                }, n.timeout + n.cssAnimationDuration));
            };
            mt(),
              n.pauseOnHover &&
                (S.addEventListener("mouseenter", function () {
                  S.classList.add("nx-paused"),
                    clearTimeout(tt),
                    clearTimeout(et);
                }),
                S.addEventListener("mouseleave", function () {
                  S.classList.remove("nx-paused"), mt();
                }));
          }
        }
        if (n.showOnlyTheLastOne && R > 0)
          for (
            var gt = t.document.querySelectorAll(
                "[id^=" + n.ID + "-]:not([id=" + n.ID + "-" + R + "])"
              ),
              nt = 0;
            nt < gt.length;
            nt++
          ) {
            var at = gt[nt];
            at.parentNode !== null && at.parentNode.removeChild(at);
          }
        n = y(!0, n, D);
      },
      V = {
        Notify: {
          init: function (p) {
            (n = y(!0, o, p)), k(T, "NotiflixNotifyInternalCSS");
          },
          merge: function (p) {
            if (n) n = y(!0, n, p);
            else
              return (
                u(
                  "You have to initialize the Notify module before call Merge function."
                ),
                !1
              );
          },
          success: function (p, m, g) {
            I(a.Success, p, m, g);
          },
          failure: function (p, m, g) {
            I(a.Failure, p, m, g);
          },
          warning: function (p, m, g) {
            I(a.Warning, p, m, g);
          },
          info: function (p, m, g) {
            I(a.Info, p, m, g);
          },
        },
      };
    return typeof t.Notiflix == "object"
      ? y(!0, t.Notiflix, { Notify: V.Notify })
      : { Notify: V.Notify };
  });
})(St);
var Bt = St.exports;
const It = document.querySelector("body"),
  Dt = document.querySelector("header"),
  Mt = document.getElementById("loginBtn"),
  dt = document.getElementById("menuButton"),
  Tt = document.getElementById("mobileMenu"),
  Zt = document.querySelectorAll(".offer-btn"),
  _t = document.querySelectorAll(".radio-link"),
  Xt = document.querySelectorAll(".accordion-header");
dt.addEventListener("click", () => {
  dt.classList.toggle("active"),
    It.classList.toggle("overflow-hidden"),
    Tt.classList.toggle("hidden"),
    Mt.classList.toggle("hidden"),
    Dt.classList.toggle("active");
});
function Vt() {
  dt.classList.remove("active"),
    It.classList.remove("overflow-hidden"),
    Tt.classList.add("hidden"),
    Mt.classList.remove("hidden"),
    Dt.classList.remove("active");
}
document.querySelectorAll(".mobile-link").forEach((r) => {
  r.addEventListener("click", (t) => {
    t.preventDefault();
    const e = r.getAttribute("href").replace("#", ""),
      i = document.getElementById(e);
    i && (Vt(), i.scrollIntoView({ behavior: "smooth" }));
  });
});
let K = null;
_t.forEach((r) => {
  r.addEventListener("click", (t) => {
    t.preventDefault();
    const e = r.querySelector(".audio-container"),
      i = r.querySelector("audio");
    if (
      (console.log("Audio element:", i),
      console.log(
        "Audio source:",
        (i == null ? void 0 : i.currentSrc) || (i == null ? void 0 : i.src)
      ),
      console.log("Audio ready state:", i == null ? void 0 : i.readyState),
      r.classList.contains("active"))
    ) {
      r.classList.remove("active"),
        i &&
          (i.pause(),
          (i.currentTime = 0),
          e.classList.remove("playing"),
          (K = null));
      return;
    }
    if (
      (_t.forEach((s) => {
        var n;
        s.classList.remove("active");
        const a = s.querySelector("audio");
        a &&
          (a.pause(),
          (a.currentTime = 0),
          (n = s.querySelector(".audio-container")) == null ||
            n.classList.remove("playing"));
      }),
      r.classList.add("active"),
      i)
    )
      try {
        (i.volume = 1), (i.muted = !1);
        const s = i.play();
        s !== void 0
          ? s
              .then(() => {
                console.log("Successfully playing audio"),
                  e.classList.add("playing"),
                  (K = i);
              })
              .catch((a) => {
                console.error("Error playing audio:", a),
                  e.classList.remove("playing"),
                  (K = null);
              })
          : (console.log("Play promise is undefined, trying direct play"),
            i.play(),
            e.classList.add("playing"),
            (K = i));
      } catch (s) {
        console.error("Error in audio playback:", s);
      }
    else console.error("Audio element not found in link:", r);
  });
});
Zt.forEach((r) => {
  r.addEventListener("click", () => {
    r.closest("li").classList.toggle("active");
  });
});
Xt.forEach((r) => {
  r.addEventListener("click", () => {
    const t = r.nextElementSibling;
    r.classList.toggle("active"),
      (t.style.maxHeight = r.classList.contains("active")
        ? `${t.scrollHeight}px`
        : "0");
  });
});
document.querySelectorAll(".phoneMask").forEach((r) => {
  d(r, { mask: "+{7} (000) 000 00 00" });
});
Bt.Notify.init({
  width: "360px",
  distance: "20px",
  fontSize: "16px",
  plainText: !1,
  useIcon: !1,
  success: { background: "#FAC114", textColor: "#362000" },
});
document.querySelectorAll(".sendFormBtn").forEach((r) => {
  r.addEventListener("click", async (t) => {
    t.preventDefault(), console.log("Кнопка отправки нажата");
    const e = r.closest("form"),
      i = e.querySelectorAll("input");
    if (!Qt(i)) {
      console.error("Форма не прошла валидацию!");
      return;
    }
    const a = e.querySelector(".input-name"),
      n = e.querySelector(".input-company"),
      o = e.querySelector(".phoneMask");
    if (
      (console.log("Найденные поля:", {
        nameInput: a == null ? void 0 : a.value,
        companyInput: n == null ? void 0 : n.value,
        phoneInput: o == null ? void 0 : o.value,
      }),
      !a || !n || !o)
    ) {
      console.error("Не найдены все необходимые поля формы");
      return;
    }
    v;
    const u = {
      name: a.value,
      company_name: n.value,
      phone: o.value,
      from: "asia",
    };
    console.log("Отправляемые данные:", u);
    try {
      console.log("Начинаем отправку на сервер...");
      const l = await fetch("https://soundservice.me/api/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(u),
      });
      console.log("Ответ получен:", l);
      const k = await l.json();
      if ((console.log("Данные ответа:", k), !l.ok))
        throw new Error(`Ошибка сервера: ${l.status}`);
      Bt.Notify.success(
        "Спасибо за заявку! <br/> Мы свяжемся с вами в течение рабочего дня."
      ),
        Jt(e);
    } catch (l) {
      console.error("Ошибка:", l),
        alert(
          "Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз."
        );
    }
  });
});
function Qt(r) {
  let t = !0;
  return (
    r.forEach((e) => {
      const i = e.closest(".input-wrapper"),
        s = e.classList.contains("phoneMask"),
        a = e.value.replace(/\D/g, "").length;
      i.classList.remove("error"),
        (e.value.trim() === "" || (s && a < 11)) &&
          ((t = !1), i.classList.add("error"));
    }),
    t
  );
}
function Jt(r) {
  r.querySelectorAll(".input-wrapper").forEach((t) => {
    t.classList.remove("error");
  }),
    r.querySelectorAll("input").forEach((t) => {
      t.value = "";
    });
}
document.querySelectorAll(".input-wrapper input").forEach((r) => {
  r.addEventListener("input", () => {
    const t = r.closest(".input-wrapper"),
      e = r.classList.contains("phoneMask"),
      i = r.value.replace(/\D/g, "").length;
    t.classList.remove("error"),
      (r.value.trim() === "" || (e && i < 11)) && t.classList.add("error");
  });
});
function Nt() {
  window.innerWidth >= 1024 && Vt();
}
window.addEventListener("resize", Nt);
Nt();
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("video").play();
});
