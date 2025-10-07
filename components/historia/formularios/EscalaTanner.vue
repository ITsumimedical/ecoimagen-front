<template>
    <div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-alert text dense color="info" border="left" icon="mdi-human-male-male" class="text-center"><b>ESCALA DE
              TANNER</b></v-alert>
          <v-col class="d-flex justify-center align-center">
            <strong>Escala para valorar la maduración sexual, por favor seleccione en cada item el estadio en el que se
              encuentra</strong>
            <v-col>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="primary" dark v-bind="attrs" v-on="on" @click="redireccionarLink()">
                    mdi-download-circle-outline
                  </v-icon>
                </template>
                <span>Descargar instructivo de la escala</span>
              </v-tooltip>
            </v-col>
          </v-col>

          <v-row v-if="(this.datos.afiliado.sexo === 'F')">
            <v-col cols="12" sm="6" md="6">
              <v-alert text dense color="warning" border="left" class="text-center">
                <b> DESARROLLO MAMARIO MUJERES</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-alert text dense color="warning" border="left" class="text-center">
                <b> DESARROLLO DEL VELLO PUBIANO MUJERES</b>
              </v-alert>
            </v-col>


            <v-col cols="12" sm="6" md="6">
              <v-radio-group v-model="tanner.mamario_mujeres" column :rules="camposRequeridos">
                <v-radio label="Estadio 1 (S1) Mamas infantiles. Solo el pezón está ligeramente sobre elevado. "
                  value="S1">
                </v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 2 (G2) Brote mamario. Las areolas y pezones sobresalen como un cono. Esto indica la existencia de tejido glandular subyacente. Aumento del diámetro de la areola."
                  value="S2"></v-radio>
                <v-divider></v-divider>

                <v-radio
                  label="Estadio 3 (S3) Continuación del crecimiento con elevación de mama y areola en un mismo plano."
                  value="S3"></v-radio>
                <v-divider></v-divider>


                <v-radio
                  label="Estadio 4 (S4) La areola y el pezón pueden distinguirse como una segunda elevación, por encima del contorno de la mama."
                  value="S4"></v-radio>
                <v-divider></v-divider>

                <v-radio
                  label="Estadio 5 (S5) Desarrollo mamario total. La areola se encuentra a nivel de la piel, y sólo sobresale el pezón (Nota: en algunos casos, la mujer adulta puede mantenerse en estadio 4)."
                  value="S5"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-radio-group v-model="tanner.pubiano_mujeres" column :rules="camposRequeridos">
                <v-radio label="Estadio 1 (P1) Ligera vellosidad infantil." value="P1"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 2 (P2) Vello escaso, lacio y ligeramente pigmentado, usualmente a lo largo de los labios (dificultad para apreciar en la figura.)"
                  value="P2"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 3 (P3) Vello rizado, aun escasamente desarrollado, pero oscuro, claramente pigmentado, sobre los labios."
                  value="P3"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 4 (P4) Vello pubiano de tipo adulto, pero no con respecto a la distribución (crecimiento del vello hacia los pliegues inguinales, pero no en la cara interna de los muslos.)."
                  value="P4"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 5 (P5) Desarrollo de la vellosidad adulta con respecto a tipo y cantidad; el vello se extiende en forma de un patrón horizontal, el llamado femenino (el vello crece también en la cara interna de los muslos).En el 10% se extiende por fuera del triángulo pubiano (estadio 6)."
                  value="P5"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row v-if="(this.datos.afiliado.sexo === 'M')">
            <v-col cols="12" md="12" sm="12">
              <v-alert text dense color="blue-grey" border="left" class="text-center">
                <b>DESARROLLO PUBERAL EN HOMBRE</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-alert text dense color="warning" border="left" class="text-center">
                <b>DESARROLLO GENITAL HOMBRE</b>
              </v-alert>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-alert text dense color="warning" border="left" class="text-center">
                <b>DESARROLLO DEL VELLO PUBIANO HOMBRES</b>
              </v-alert>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-radio-group v-model="tanner.genital_hombres" column :rules="camposRequeridos">
                <v-radio
                  label="Estadio 1 (G1) Pene, escroto y testículos infantiles; es decir, de aproximadamente el mismo tamaño y forma que en la infancia."
                  value="G1"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 2 (G2) Agrandamiento de escroto y testículos. La piel escrotal se vuelve más roja, delgada y arrugada. El pene no tiene ningún agrandamiento o muy insignificante."
                  value="G2"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 3 (G3) Agrandamiento del pene, principalmente en longitud. Continuación del desarrollo testicular y escrotal."
                  value="G3"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 4 (G4) Aumento de tamaño de pene con crecimiento de diámetro y desarrollo del glande. Continuación de agrandamiento de testículos y escroto. Aumento de la pigmentación de la piel escrotal"
                  value="G4"></v-radio>
                <v-divider></v-divider>
                <v-radio label="Estadio 5 (G5) Genitales de tipo y tamaño adulto" value="G5"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-radio-group v-model="tanner.pubiano_hombres" column :rules="camposRequeridos">
                <v-radio label="Estadio 1 (P1) Ligera vellosidad infantil." value="P1"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 2 (P2) Vello escaso, lacio y ligeramente pigmentado, usualmente arraigado al pene (dificultad para apreciar en la fig.)."
                  value="P2"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 3 (P3) Vello rizado, aun escasamente desarrollado, pero oscuro, claramente pigmentado,arraigado al pene."
                  value="P3"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 4 (P4) Vello pubiano de tipo adulto, pero con respecto a la distribución (crecimiento del vello hacia los pliegues inguinales, pero no en la cara interna delos muslos.)."
                  value="P4"></v-radio>
                <v-divider></v-divider>
                <v-radio
                  label="Estadio 5 (P5) Desarrollo de la vellosidad adulta con respecto a tipo y cantidad; el vello se extiende en forma de un patrón horizontal, el llamado femenino (el vello crece también en la cara interna de los muslos).En el 80% de los casos, el crecimiento del vello continúa hacia arriba, a lo largo de la línea alba"
                  value="P5"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <!-- <v-card-actions class="justify-center">
            <v-btn color="success" small @click="crearTanner()" :loading="loading">Guardar respuestas</v-btn>
          </v-card-actions> -->
        </v-container>
      </v-form>

    </div>
  </template>


  <script>
  import { mapGetters } from 'vuex';

    export default {
      props: ['datos'],
      data() {
        return {
          tanner: {
            mamario_mujeres: null,
            pubiano_mujeres: null,
            genital_hombres: null,
            pubiano_hombres: null,
            consulta_id: this.datos.id,
          },
          row: null,
          valid: true,
          loading: false,
          camposRequeridos: [
          v => !!v || 'Este campo es requerido',
        ],
        }
      },

      mounted() {
        this.cargarDatos();
        const datosTanner = this.obtenerDatosPorConsulta(this.datos.id, 'Tanner/Model/EscalaTanner', 'historia/formularios/EscalaTanner');
        if (datosTanner) {
            this.tanner = {...datosTanner}
        }
      },

      computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

      methods: {
        redireccionarLink() {
          window.open('https://cdn.adolescenciasema.org/usuario/documentos/A4.pdf', '_blank');
        },

        obtenerDatos() {
            return { datos: this.tanner };
        },

        crearTanner() {
          if(!this.$refs.form.validate()) {
            return this.$toast.error('Debe completar todos los campos');
          }
          this.loading = true;
          this.$axios.post('tanner/crear', this.tanner).then(() => {
            this.$toast.success('Tanner creado correctamente')
          }).catch((error) => {
            console.log(error)
          }).finally(() => {
            this.loading = false;
          })
        },
        validarErrores() {
        // Validar los campos en los tipos de historia requeridos
        return this.$refs.form.validate();
      },
        cargarDatos() {
          this.$axios.get(`tanner/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
            this.tanner = {
              ...this.tanner,
              ...res.data
            }
          }).catch(error => {
            console.log(error);
            this.$toast.error('Error al cargar los datos');
          });
        },
      }
    }

  </script>
