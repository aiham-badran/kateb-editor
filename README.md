# Kateb Editor Toolkit

> مكتبة مفتوحة المصدر لبناء محررات نصوص عربية احترافية بنظام البلوكات (Block Editor) باستخدام TypeScript و ProseMirror.

[![npm version](https://img.shields.io/npm/v/kateb-editor.svg)](https://www.npmjs.com/package/kateb-editor)
[![license](https://img.shields.io/npm/l/kateb-editor.svg)](LICENSE)

## ✨ المميزات

- **دعم كامل للغة العربية** – اتجاه RTL، علامات الترقيم العربية (، ؟ ؛)، وتحويل تلقائي عند الكتابة.
- **نظام البلوكات (Block‑based)** – مستندات مرنة مع إمكانية إضافة بلوكات مخصصة.
- **قابلية التوسع** – أضف بلوكاتك وعلاماتك الخاصة بسهولة.
- **واجهة مستخدم جاهزة** – شريط أدوات عائم وقائمة Slash للبلوكات، مع إمكانية تعطيلها.
- **اختصارات لوحة المفاتيح** – تدعم التنسيق (غامق، مائل) وتحويل البلوكات.
- **مُحسَّن للعربية** – كشف تلقائي لاتجاه النص (RTL/LTR) في الفقرات.
- **مستقل عن الأطر** – يعمل مع Vanilla JS أو React / Vue / أي إطار.

---

## 🚀 التثبيت

```bash
npm install kateb-editor
```

---

## 📖 الاستخدام الأساسي

```javascript
import { KatebEditor, blocks, marks } from "kateb-editor";

const editor = new KatebEditor(document.getElementById("editor"), {
  blocks: [blocks.paragraphBlock, blocks.headingBlock],
  marks: [marks.strongMark, marks.emMark],
  enableToolbar: true,
  enableSlashMenu: true,
});
```

> `paragraphBlock` و `headingBlock` و `strongMark` و `emMark` هي البلوكات والعلامات الافتراضية التي توفرها المكتبة. يمكنك أيضاً إنشاء بلوكاتك الخاصة.

---

## 🧩 إضافة بلوك مخصص

أنشئ بلوكاً جديداً باستخدام الكلاس `Block` أو الدالة المساعدة `createBlock`:

```javascript
import { createBlock, createToolbarButton } from "kateb-editor";

const customBlock = createBlock(
  "custom",
  {
    content: "inline*",
    group: "block",
    toDOM() {
      return ["div", 0];
    },
  },
  {
    slashLabel: "مخصص",
    toolbarButtons: [
      createToolbarButton("C", (state, dispatch) => {
        // أمر مخصص (مثلاً إدراج نص)
      }),
    ],
    keymap: {
      "Ctrl-Alt-C": (state, dispatch) => {
        /* ... */
      },
    },
  },
);
```

ثم أضفه إلى المحرر:

```javascript
const editor = new KatebEditor(container, {
  blocks: [customBlock],
});
```

---

## 🏷️ إضافة علامة (Mark) مخصصة

```javascript
import { createMark, createToolbarButton } from "kateb-editor";

const highlightMark = createMark(
  "highlight",
  {
    parseDOM: [{ tag: "mark" }],
    toDOM() {
      return ["mark", 0];
    },
  },
  {
    toolbarButtons: [
      createToolbarButton("H", (state, dispatch) => {
        // أمر تطبيق العلامة
      }),
    ],
  },
);

const editor = new KatebEditor(container, {
  marks: [highlightMark],
});
```

---

## ⚙️ خيارات التهيئة

| الخيار            | النوع     | الافتراضي | الوصف                                                    |
| ----------------- | --------- | --------- | -------------------------------------------------------- |
| `enableToolbar`   | `boolean` | `true`    | إظهار شريط الأدوات العائم.                               |
| `enableSlashMenu` | `boolean` | `true`    | تفعيل قائمة Slash عند كتابة `/`.                         |
| `blocks`          | `Block[]` | `[]`      | قائمة البلوكات المراد استخدامها (تُضاف الفقرة تلقائياً). |
| `marks`           | `Mark[]`  | `[]`      | قائمة العلامات (مثل غامق، مائل).                         |

---

## 🛠️ دوال مساعدة

- `createBlock(name, spec, options)` – إنشاء بلوك.
- `createMark(name, spec, options)` – إنشاء علامة.
- `createToolbarButton(label, command, isActive?)` – إنشاء زر شريط.
- `createSlashMenuItem(label, searchTerms?)` – إنشاء عنصر قائمة.
- `createKeymap(shortcuts)` – إنشاء خريطة اختصارات (للتوحيد).

---

## 📦 مثال متكامل مع Vanilla JS

```html
<div id="editor"></div>
<script type="module">
  import { KatebEditor, blocks, marks } from "kateb-editor";

  const editor = new KatebEditor(document.getElementById("editor"), {
    blocks: [blocks.paragraphBlock, blocks.headingBlock],
    marks: [marks.strongMark, marks.emMark],
  });

  // الحصول على المحتوى
  console.log(editor.getContent());
</script>
```

---

## 🤝 المساهمة

المشروع مفتوح المصدر، نرحب بمساهماتكم!  
يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) و[قواعد السلوك](CODE_OF_CONDUCT.md).

---

## 📄 الترخيص

MIT License – انظر ملف [LICENSE](LICENSE).

---

## 🌐 الروابط

- [GitHub Repository](https://github.com/aiham-badran/kateb-editor)
- [نموذج تجريبي (Demo)](https://aiham-badran.github.io/kateb-editor/)
- [توثيق API](https://your-username.github.io/kateb-editor/docs/)
