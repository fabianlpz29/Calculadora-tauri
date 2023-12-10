const { invoke } = window.__TAURI__.tauri;

class Calculadora {
  constructor(valorPrevioTextElement, valorActualTextElement) {
      this.valorPrevioTextElement = valorPrevioTextElement;
      this.valorActualTextElement = valorActualTextElement;
      this.borrarTodo(); // Inicializa la calculadora al crear una instancia.
  }

  borrarTodo() {
      this.valorActual = '';
      this.valorPrevio = '';
      this.operacion = undefined;
  }

  borrar() {
      this.valorActual = this.valorActual.toString().slice(0, -1);
  }

  agregarNumero(numero) {
      if (numero === '.' && this.valorActual.includes('.')) return;
      // Punto#1: Verifica la longitud del valor actual.
      if (this.valorActual.length < 11) { 
          this.valorActual = this.valorActual.toString() + numero.toString();
      }
  }
  

  elejirOperacion(operacion) {
      if (this.valorActual === '') return;
      if (this.valorPrevio !== '') {
          this.calcular();
          this.actualizarPantalla();
      }
      this.operacion = operacion;
      this.valorPrevio = this.valorActual;
      this.valorActual = '';
  }

  calcular() {
      let resultado;
      const valor_1 = parseFloat(this.valorPrevio);
      const valor_2 = parseFloat(this.valorActual);

      if (isNaN(valor_1) || isNaN(valor_2)) return;

      switch (this.operacion) {
          case '+':
              resultado = valor_1 + valor_2;
              break;
          case '-':
              resultado = valor_1 - valor_2;
              break;
          case 'x':
              resultado = valor_1 * valor_2;
              break;
          case '÷':
              resultado = valor_1 / valor_2;
              break;
          // Punto#2: Agrega caso para el porcentaje.
          case '%':
              resultado = (valor_1 / 100) * valor_2;
              break;
          default:
              return;
      }
      this.valorActual = resultado;
      this.operacion = undefined;
      this.valorPrevio = '';
  }

  obtenerNumero(numero) {
      const cadena = numero.toString();
      const enteros = parseFloat(cadena.split('.')[0]);
      const decimales = cadena.split('.')[1];
      let mostrarEnteros;
      if (isNaN(enteros)) {
          mostrarEnteros = '';
      } else {
          mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 });
      }

      if (decimales != null) {
          return `${mostrarEnteros}.${decimales}`;
      } else {
          return mostrarEnteros;
      }
  }

  actualizarPantalla() {
      this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual);

      if (this.operacion !== undefined) {
          // Punto#4: Muestra la operación completa en el display superior mientras se realiza la operación.
          this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)} =`;
      } else {
          this.valorPrevioTextElement.innerText = '';
      }
  }
}

// Captura de datos del DOM
const numeroButtons = document.querySelectorAll('[data-numero]');
const operacionButtons = document.querySelectorAll('[data-operacion]');
const igualButton = document.querySelector('[data-igual]');
const porcentajeButton = document.querySelector('[data-porcentaje]');
const borrarButton = document.querySelector('[data-borrar]');
const borrarTodoButton = document.querySelector('[data-borrar-todo]');
const valorPrevioTextElement = document.querySelector('[data-valor-previo]');
const valorActualTextElement = document.querySelector('[data-valor-actual]');

// Instanciar un nuevo objeto de tipo calculadora
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement);



//#punto 3
// Variable para verificar si el primer número ya ha sido ingresado.
let primerNumeroIngresado = false;

numeroButtons.forEach(button => {
  button.addEventListener('click', () => {
      // Si no hay una operación pendiente:
      if (calculator.operacion === undefined) {
          // Si aún no se ha ingresado el primer número:
          if (primerNumeroIngresado === false) {
              calculator.borrarTodo();
              // Marcar que ya se ingresó el primer número.
              primerNumeroIngresado = true;
          }
      } else {
          // Si hay una operación pendiente:
          // Marcar que se ingresó el segundo número.
          primerNumeroIngresado = false;
      }
      calculator.agregarNumero(button.innerText);
      calculator.actualizarPantalla();
  });
});


operacionButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.elejirOperacion(button.innerText);
      calculator.actualizarPantalla();
  });
});

igualButton.addEventListener('click', _button => {
  calculator.calcular();
  // Punto#4: Muestra la operación completa.
  calculator.valorActualTextElement.innerText = calculator.obtenerNumero(calculator.valorActual);
  calculator.valorPrevio = calculator.resultado.toString();
  calculator.valorActual = calculator.resultado.toString();
  calculator.operacion = undefined;
  calculator.actualizarPantalla();
});

// Punto#2: Agrega un evento al botón de Porcentaje (%) para calcular el porcentaje de un número.
porcentajeButton.addEventListener('click', () => {
  calculator.elejirOperacion('%');
  calculator.actualizarPantalla();
});

borrarTodoButton.addEventListener('click', _button => {
  calculator.borrarTodo();
  calculator.actualizarPantalla();
});

borrarButton.addEventListener('click', _button => {
  calculator.borrar();
  calculator.actualizarPantalla();
});

/*Parcial:
1. Arreglar bug que limite los numeros en pantalla LISTO
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/

