const ICON_RULES = [
  { regex: /dog food|kibble|puppy|adult dog/, icon: "🍖" },
  { regex: /cat food|wet food|tuna|kitten/, icon: "🐟" },
  { regex: /milk|formula/, icon: "🍼" },
  { regex: /treat/, icon: "🍪" },
  { regex: /collar|leash|harness|tag/, icon: "🪢" },
  { regex: /scratch|tower|post/, icon: "🪵" },
  { regex: /groom|brush|comb|clipper|kit/, icon: "✂️" },
  { regex: /toy|ball|play/, icon: "🎾" },
  { regex: /bed|cushion|mat/, icon: "🛏️" },
  { regex: /deworm|tablet|pill|medic/, icon: "💊" },
  { regex: /flea|tick/, icon: "🐛" },
  { regex: /spray|antiseptic|wound|first aid|shampoo/, icon: "🧴" },
  { regex: /supplement|vitamin|nutrition/, icon: "🧬" },
  { regex: /cage|carrier|house/, icon: "🏠" },
  { regex: /dog/, icon: "🐶" },
  { regex: /cat/, icon: "🐱" },
  { regex: /bird/, icon: "🐦" },
  { regex: /fish/, icon: "🐠" },
];

const CATEGORY_ICONS = { 1: "🍖", 2: "🦴", 3: "💊" };

export function getProductIcon(product) {
  const name = product.name.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.regex.test(name)) return rule.icon;
  }
  return CATEGORY_ICONS[product.category_id] || "🐾";
}
