const items = [
  { key: "dni", label: "DNI", generate: generateDni },
  { key: "nie", label: "NIE", generate: generateNie },
  { key: "cif", label: "CIF", generate: generateCif },
  { key: "pasaporte", label: "Pasaporte", generate: generatePassport },
  { key: "iban", label: "IBAN", generate: generateIban },
  { key: "tarjeta", label: "Tarjeta credito", generate: generateCard },
  { key: "telefono", label: "Telefono", generate: generatePhone },
  { key: "email", label: "Email", generate: generateEmail },
  { key: "nombre", label: "Nombre completo", generate: generateFullName },
  { key: "direccion", label: "Direccion", generate: generateAddress },
  { key: "cp", label: "Codigo postal", generate: generatePostalCode },
  { key: "fecha", label: "Fecha nacimiento", generate: generateBirthDate },
  { key: "contrasena", label: "Contrasena", generate: generatePassword }
];

const list = document.getElementById("list");
const template = document.getElementById("item-template");
const regen = document.getElementById("regen");

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(value, size) {
  return String(value).padStart(size, "0");
}

function pick(values) {
  return values[randInt(0, values.length - 1)];
}

function generateDni() {
  const number = randInt(0, 99999999);
  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const letter = letters[number % 23];
  return `${pad(number, 8)}${letter}`;
}

function generateNie() {
  const prefix = pick(["X", "Y", "Z"]);
  const number = randInt(0, 9999999);
  const prefixValue = { X: 0, Y: 1, Z: 2 }[prefix];
  const base = `${prefixValue}${pad(number, 7)}`;
  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const letter = letters[Number(base) % 23];
  return `${prefix}${pad(number, 7)}${letter}`;
}

function generateCif() {
  const types = "ABCDEFGHJNPQRSUVW";
  const type = pick(types.split(""));
  const digits = Array.from({ length: 7 }, () => randInt(0, 9));
  const sumEven = digits
    .filter((_, index) => (index + 1) % 2 === 0)
    .reduce((acc, value) => acc + value, 0);
  const sumOdd = digits
    .filter((_, index) => (index + 1) % 2 === 1)
    .reduce((acc, value) => {
      const prod = value * 2;
      return acc + Math.floor(prod / 10) + (prod % 10);
    }, 0);
  const total = sumEven + sumOdd;
  const controlDigit = (10 - (total % 10)) % 10;
  const controlLetters = "JABCDEFGHI";
  let control;
  if ("PQRSNW".includes(type)) {
    control = controlLetters[controlDigit];
  } else if ("ABEH".includes(type)) {
    control = String(controlDigit);
  } else {
    control = Math.random() > 0.5 ? String(controlDigit) : controlLetters[controlDigit];
  }
  return `${type}${digits.join("")}${control}`;
}

function generatePassport() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alpha = `${pick(letters)}${pick(letters)}`;
  return `P${alpha}${pad(randInt(0, 999999), 6)}`;
}

function generateIban() {
  const bank = pad(randInt(0, 9999), 4);
  const branch = pad(randInt(0, 9999), 4);
  const account = pad(randInt(0, 9999999999), 10);
  const dc1 = calcControlDigit(`${bank}${branch}`, [4, 8, 5, 10, 9, 7, 3, 6]);
  const dc2 = calcControlDigit(account, [1, 2, 4, 8, 5, 10, 9, 7, 3, 6]);
  const bban = `${bank}${branch}${dc1}${dc2}${account}`;
  const checkDigits = calcIbanCheckDigits("ES", bban);
  return `ES${checkDigits}${bban}`;
}

function calcControlDigit(value, weights) {
  const sum = value
    .split("")
    .map(Number)
    .reduce((acc, digit, index) => acc + digit * weights[index], 0);
  let result = 11 - (sum % 11);
  if (result === 10) result = 1;
  if (result === 11) result = 0;
  return result;
}

function calcIbanCheckDigits(country, bban) {
  const rearranged = `${bban}${country}00`;
  const numeric = rearranged.replace(/[A-Z]/g, (char) => String(char.charCodeAt(0) - 55));
  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return pad(98 - remainder, 2);
}

function generateCard() {
  const prefix = pick([4, 5]);
  const digits = [prefix];
  while (digits.length < 15) {
    digits.push(randInt(0, 9));
  }
  const check = luhnCheckDigit(digits);
  return `${digits.join("")}${check}`;
}

function luhnCheckDigit(digits) {
  const sum = digits
    .slice()
    .reverse()
    .map((digit, index) => {
      if (index % 2 === 0) return digit;
      const doubled = digit * 2;
      return doubled > 9 ? doubled - 9 : doubled;
    })
    .reduce((acc, value) => acc + value, 0);
  return (10 - (sum % 10)) % 10;
}

function generatePhone() {
  const start = pick([6, 7, 9]);
  return `${start}${pad(randInt(0, 99999999), 8)}`;
}

function generateEmail() {
  const name = pick(["mario", "lucia", "carlos", "ines", "sofia", "hugo", "nuria", "daniel"]);
  const surname = pick(["rojas", "lopez", "soto", "diaz", "martin", "vega", "ruiz"]);
  const domain = pick(["ejemplo.com", "correo.es", "prueba.net", "demo.org"]);
  return `${name}.${surname}${randInt(10, 99)}@${domain}`;
}

function generateFullName() {
  const name = pick(["Mario", "Lucia", "Carlos", "Ines", "Sofia", "Hugo", "Nuria", "Daniel", "Aitana"]);
  const surname = pick(["Rojas", "Lopez", "Soto", "Diaz", "Martin", "Vega", "Ruiz", "Navarro"]);
  const surname2 = pick(["Gomez", "Sanz", "Iglesias", "Ortega", "Cruz", "Silva", "Molina"]);
  return `${name} ${surname} ${surname2}`;
}

function generateAddress() {
  const street = pick(["Gran Via", "Avenida del Sol", "Calle Mayor", "Paseo Maritimo", "Calle del Prado"]);
  return `${street}, ${randInt(1, 199)}`;
}

function generatePostalCode() {
  const province = pad(randInt(1, 52), 2);
  return `${province}${pad(randInt(0, 999), 3)}`;
}

function generateBirthDate() {
  const year = randInt(1960, 2004);
  const month = randInt(1, 12);
  const day = randInt(1, 28);
  return `${pad(day, 2)}/${pad(month, 2)}/${year}`;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => pick(chars)).join("");
}

function render() {
  list.innerHTML = "";
  items.forEach((item, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".card");
    const label = node.querySelector(".label");
    const value = node.querySelector(".value");
    const copy = node.querySelector(".copy");

    const generated = item.generate();
    label.textContent = item.label;
    value.textContent = generated;
    copy.dataset.value = generated;
    card.style.animationDelay = `${index * 0.05}s`;

    list.appendChild(node);
  });
}

async function copyValue(button) {
  const value = button.dataset.value || "";
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  button.classList.add("copied");
  const original = button.textContent;
  button.textContent = "Copiado";
  setTimeout(() => {
    button.classList.remove("copied");
    button.textContent = original;
  }, 1200);
}

list.addEventListener("click", (event) => {
  const button = event.target.closest(".copy");
  if (!button) return;
  copyValue(button);
});

regen.addEventListener("click", () => {
  render();
});

render();
