<template>
  <div>
    <v-alert text dense color="info" border="left" icon="mdi-brain">
      <template #append>
        <v-btn small color="secondary" outlined @click="descargarGuia" class="ml-2">
          Guía
        </v-btn>
      </template>
      <b>MINI MENTAL</b>
    </v-alert>


    <v-form ref="minimentalForm" v-model="valid" lazy-validation>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">No.</th>
            <th class="text-left">Descripción</th>
            <th class="text-left">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Diga en qué año estamos
            </td>
            <td>
              <v-text-field v-model="mental.anio" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Diga en qué mes estamos:</td>
            <td>
              <v-text-field v-model="mental.mes" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Diga en que día estamos</td>
            <td>
              <v-text-field v-model="mental.fecha_hoy" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>Diga la hora</td>
            <td>
              <v-text-field v-model="mental.hora" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>En que país estamos</td>
            <td>
              <v-text-field v-model="mental.pais" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>Diga en que ciudad estamos</td>
            <td>
              <v-text-field v-model="mental.ciudad" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>Diga en que departamento estamos</td>
            <td>
              <v-text-field v-model="mental.departamento" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>8</td>
            <td>Diga en que sitio o lugar estamos</td>
            <td>
              <v-text-field v-model="mental.sitio_lugar_esta" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>9</td>
            <td>Diga en que piso/barrio/vereda estamos</td>
            <td>
              <v-text-field v-model="mental.piso_barrio_vereda_esta" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]">
              </v-text-field>

            </td>
          </tr>
          <tr>
            <td>10</td>
            <td>Diga las siguientes palabras CASA, MESA, ÁRBOL. Un segundo por cada una. Luego
              pida a la persona que las repita. Asignándole un punto por cada una. Si en un primer
              intento no logra repetir las palabras, repítalas hasta que la persona las registre. Anote el
              número de ensayos requeridos</td>
            <td>
              <v-text-field v-model="mental.memoria_repeticiones" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 3), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>11</td>
            <td>Reste 100 - 7 en forma sucesiva durante 5 veces. Registre un punto por cada respuesta
              correcta: 93-86-79-72-65.
              En el caso que la persona no sepa restar utilizar la siguiente alternativa: Decir los meses
              del año al revés: Diciembre, noviembre, octubre, septiembre, agosto.</td>
            <td>
              <v-text-field v-model="mental.atencion_calculo" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 5), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>12</td>
            <td>De las palabras anteriormente mencionadas, diga las palabras que recuerde</td>
            <td>
              <v-text-field v-model="mental.evocacion" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 3), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>13</td>
            <td>Mostrar un lápiz y un reloj y preguntar el nombre de los objetos (Denominación) </td>
            <td>
              <v-text-field v-model="mental.denominacion" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 2), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>14</td>
            <td>Hay que pedir que repita la siguiente frase: En el trigal había cinco perros</td>
            <td>
              <v-text-field v-model="mental.repite_frase" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>15</td>
            <td>Comprensión obedecer una orden en tres etapas: A continuación, le voy a dar una
              orden, escúchela toda y realícela: Tome esta hoja de papel con su mano derecha,
              dóblela por la mitad y póngala en el piso. (De un punto por cada una de las ordenes
              ejecutadas correctamente).</td>
            <td>
              <v-text-field v-model="mental.obedece_orden" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 3), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>16</td>
            <td>Para las siguientes dos órdenes utilice una tarjeta u hoja de papel que contenga la frase:
              “cierre sus ojos”. Indique:
              • Hay que pedir que lea y ejecute lo que dice la frase que contiene la tarjeta. (Lectura)</td>
            <td>
              <v-text-field v-model="mental.obedece_dos_ordenes" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>17</td>
            <td>Hay que pedir que escriba la frase que contiene la tarjeta. (Escritura)</td>
            <td>
              <v-text-field v-model="mental.escribe_frase_tarjeta" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>
          <tr>
            <td>18</td>
            <td>
              <div>
                Indique a la persona que copie el siguiente diseño (dos pentágonos cruzados en un ángulo):
                <br>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjDe5uHDlblafXYUruJtXpPaJAjB5XM1o36A&s"
                  alt="Dos pentágonos cruzados en un ángulo" width="100" height="100">
              </div>
            </td>
            <td>
              <v-text-field v-model="mental.realiza_bien_diseño" type="number" label="Puntuación" :rules="[...generarRuleEntre(0, 1), ...campoRequerido]"></v-text-field>
            </td>
          </tr>

        </tbody>
      </v-simple-table>
      <v-divider></v-divider>
      <v-alert v-if="alertaMensaje" type="warning" dense text>
        {{ alertaMensaje }}
      </v-alert>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos'],
    data() {
      return {
        campoRequerido: [
                  v => !!v || 'Campo requerido',
                ],
        realizarTest: false,
        mental: {
          anio: '',
          mes: '',
          fecha_hoy: '',
          hora: '',
          pais: '',
          ciudad: '',
          departamento: '',
          sitio_lugar_esta: '',
          piso_barrio_vereda_esta: '',
          memoria_repeticiones: '',
          atencion_calculo: '',
          evocacion: '',
          denominacion: '',
          repite_frase: '',
          obedece_orden: '',
          obedece_dos_ordenes: '',
          escribe_frase_tarjeta: '',
          realiza_bien_diseño: '',
        },
          generarRuleEntre(min, max) {
            return [
            v => (v !== null && v !== '' && !isNaN(v)) || 'El valor debe ser un número',
            v => (v >= min && v <= max) || `El valor debe estar entre ${min} y ${max}`
            ]
        },
        loading: false,
        valid: false,
        alertaMensaje: ''

      }
    },

    mounted() {
        const datosMinimental = this.obtenerDatosPorConsulta(this.datos.id, 'MiniMental/Model/miniMental', 'historia/formularios/miniMental');
        if (datosMinimental) {
            this.whooley = { ...datosMinimental }
        } else {
            this.cargarDatos();
        }
    },
    watch: {
            mental: {
                handler() {
                    this.calcularMinimental();
                },
                deep: true
            }
        },
        computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
            const data = {
                ...this.mental,
                resultado: this.alertaMensaje
            }
            return { datos: data };
        },
      calcularMinimental() {
        const edad = this.datos.afiliado.edad_cumplida;
        const puntuacionTotal = parseInt(this.mental.memoria_repeticiones || 0) +
          parseInt(this.mental.atencion_calculo || 0) +
          parseInt(this.mental.evocacion || 0) +
          parseInt(this.mental.denominacion || 0) +
          parseInt(this.mental.repite_frase || 0) +
          parseInt(this.mental.obedece_orden || 0) +
          parseInt(this.mental.obedece_dos_ordenes || 0) +
          parseInt(this.mental.escribe_frase_tarjeta || 0) +
          parseInt(this.mental.realiza_bien_diseño || 0);


            if (edad > 75) {
            puntuacionTotal += 2;
            } else if (edad > 65) {
            puntuacionTotal += 1;
            }


        if (puntuacionTotal === 0) {
          this.alertaMensaje = '';
          return; // Terminar la función si la puntuación total es cero
        }

        if (edad >= 0 && edad <= 5 && puntuacionTotal <= 21) {
          this.alertaMensaje = 'Sospecha de deterioro cognoscitivo, remitir a psiquiatría o neurología.';
        } else if (edad >= 6 && edad <= 12 && puntuacionTotal <= 24) {
          this.alertaMensaje = 'Sospecha de deterioro cognoscitivo, remitir a psiquiatría o neurología.';
        } else if (edad > 12 && puntuacionTotal <= 26) {
          this.alertaMensaje = 'Sospecha de deterioro cognoscitivo, remitir a psiquiatría o neurología.';
        } else if (edad > 12 && puntuacionTotal > 26 && puntuacionTotal <= 90) {
          this.alertaMensaje = 'Requiere evaluación adicional, puntuación alta.';
        } else {
          this.alertaMensaje = '';
        }
      },

      cargarDatos() {
        this.$axios.get(`mini-mental/obtenerDatos/${this.datos.afiliado.id}`)
          .then(res => {
            this.mental = {
              ...this.mental,
              ...res.data
            };
            this.calcularMinimental()
          })
          .catch(error => {
            console.log(error);
            this.$toast.error('Error al cargar los datos');
          });
      },

      descargarGuia() {
        this.$axios.get('mini-mental/guia', {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
      },
      validarErrores() {
            const campos = { ...this.mental };

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.minimentalForm.validate();
        },


    }
  }

</script>
