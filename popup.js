const items = [
  { key: "dni", label: "DNI", group: "Identificacion", generate: generateDni },
  { key: "nie", label: "NIE", group: "Identificacion", generate: generateNie },
  { key: "cif", label: "CIF", group: "Identificacion", generate: generateCif },
  { key: "pasaporte", label: "Pasaporte", group: "Identificacion", generate: generatePassport },
  { key: "iban", label: "IBAN", group: "Finanzas", generate: generateIban },
  { key: "tarjeta", label: "Tarjeta credito", group: "Finanzas", generate: generateCard },
  { key: "telefono", label: "Telefono", group: "Contacto", generate: generatePhone },
  { key: "email", label: "Email", group: "Contacto", generate: generateEmail },
  { key: "direccion", label: "Direccion", group: "Contacto", generate: generateAddress },
  { key: "cp", label: "Codigo postal", group: "Contacto", generate: generatePostalCode },
  { key: "nombre", label: "Nombre completo", group: "Personal", generate: generateFullName },
  { key: "nombre_pila", label: "Nombre", group: "Personal", generate: generateFirstName },
  { key: "apellido1", label: "Apellido 1", group: "Personal", generate: generateSurname1 },
  { key: "apellido2", label: "Apellido 2", group: "Personal", generate: generateSurname2 },
  { key: "fecha", label: "Fecha nacimiento", group: "Personal", generate: generateBirthDate },
  { key: "contrasena", label: "Contrasena", group: "Seguridad", generate: generatePassword }
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
  const name = generateFirstName();
  const surname = generateSurname1();
  const surname2 = generateSurname2();
  return `${name} ${surname} ${surname2}`;
}

function generateFirstName() {
  return pick([
    "Alejandro",
    "Alvaro",
    "Ana",
    "Andres",
    "Antonio",
    "Beatriz",
    "Carlos",
    "Carmen",
    "Clara",
    "Cristina",
    "Daniel",
    "David",
    "Diego",
    "Elena",
    "Eva",
    "Francisco",
    "Gabriel",
    "Gloria",
    "Guillermo",
    "Hugo",
    "Irene",
    "Isabel",
    "Javier",
    "Jorge",
    "Jose",
    "Juan",
    "Laura",
    "Lucia",
    "Luis",
    "Manuel",
    "Maria",
    "Marta",
    "Martin",
    "Miguel",
    "Nerea",
    "Nuria",
    "Pablo",
    "Patricia",
    "Raul",
    "Rocio",
    "Ruben",
    "Sara",
    "Sergio",
    "Sofia",
    "Teresa",
    "Victor",
    "Violeta",
    "Aitana",
    "Adrian",
    "Paula"
  ]);
}

function generateSurname1() {
  return pick([
    "Alvarez",
    "Arias",
    "Blanco",
    "Cabrera",
    "Calvo",
    "Campos",
    "Castillo",
    "Cortes",
    "Cruz",
    "Delgado",
    "Diaz",
    "Dominguez",
    "Duran",
    "Fernandez",
    "Flores",
    "Garrido",
    "Garcia",
    "Gimenez",
    "Gomez",
    "Gonzalez",
    "Guerrero",
    "Gutierrez",
    "Hernandez",
    "Herrera",
    "Iglesias",
    "Jimenez",
    "Leon",
    "Lopez",
    "Marin",
    "Martin",
    "Mendez",
    "Molina",
    "Morales",
    "Moreno",
    "Munoz",
    "Navarro",
    "Ortega",
    "Perez",
    "Prieto",
    "Ramirez",
    "Ramos",
    "Rodriguez",
    "Romero",
    "Rubio",
    "Ruiz",
    "Sanchez",
    "Serrano",
    "Soto",
    "Torres",
    "Vega"
  ]);
}

function generateSurname2() {
  return pick([
    "Alonso",
    "Aguilar",
    "Benitez",
    "Cano",
    "Carmona",
    "Carrasco",
    "Cortes",
    "Cruz",
    "Delgado",
    "Diaz",
    "Dominguez",
    "Escobar",
    "Ferrer",
    "Fuentes",
    "Gallardo",
    "Garcia",
    "Gil",
    "Gomez",
    "Gonzalez",
    "Guerrero",
    "Gutierrez",
    "Hernandez",
    "Herrera",
    "Iglesias",
    "Jimenez",
    "Lorenzo",
    "Lozano",
    "Marquez",
    "Martinez",
    "Medina",
    "Miranda",
    "Molina",
    "Morales",
    "Moreno",
    "Moya",
    "Navarro",
    "Ortega",
    "Pascual",
    "Perez",
    "Prieto",
    "Ramos",
    "Rey",
    "Rodriguez",
    "Romero",
    "Santos",
    "Sanz",
    "Serrano",
    "Silva",
    "Soto",
    "Vazquez"
  ]);
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
  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  });

  let index = 0;
  groups.forEach((groupItems, groupName) => {
    const group = document.createElement("section");
    group.className = "group";

    const title = document.createElement("h3");
    title.className = "group-title";
    title.textContent = groupName;
    group.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "group-grid";

    groupItems.forEach((item) => {
      const node = template.content.cloneNode(true);
      const card = node.querySelector(".card");
      const label = node.querySelector(".label");
      const value = node.querySelector(".value");
      const copy = node.querySelector(".copy");

      const generated = item.generate();
      label.textContent = item.label;
      value.textContent = generated;
      value.title = generated;
      copy.dataset.value = generated;
      card.style.animationDelay = `${index * 0.05}s`;
      index += 1;

      grid.appendChild(node);
    });

    group.appendChild(grid);
    list.appendChild(group);
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
    window.close();
  }, 300);
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
