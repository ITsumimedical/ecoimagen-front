<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-col cols="12" sm="12" md="12">
        <v-alert class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
          <b>SISTEMA DE EVALUACIÓN DE SÍNTOMAS DE EDMONTON-ESAS</b>
        </v-alert>
        <v-row>
          <v-col xs="12" sm="6" md="6" v-for="item in campos" :key="item.id">
            <v-label>{{item.nombre}}</v-label>
            <v-radio-group v-model="valoresEdmonton[item.id]" @change="calcularSuma" row color="primary" :rules="campoRequerido">
              <v-radio color="primary" v-for="n in 10" :key="n" :label="`${n}`" :value="n">
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-col>
    <v-alert v-if="mensaje" color="warning" icon="mdi-check-all" text dense class="text-center" border="left">
      <b>{{ mensaje }}</b>
    </v-alert>
   </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
  export default {
    name: 'HorusHealthEsasComponent',
    props: ['datos', 'resumen'],
    data() {
      return {
        campoRequerido: [
                  v => !!v || 'Campo requerido',
                ],
        campos: [{
            id: 'sin_dolor',
            nombre: 'Sin dolor'
          },
          {
            id: 'sin_cansancio',
            nombre: 'Sin cansancio'
          },
          {
            id: 'sin_nauseas',
            nombre: 'Sin nauseas'
          },
          {
            id: 'sin_tristeza',
            nombre: 'Sin tristeza'
          },
          {
            id: 'sin_ansiedad',
            nombre: 'Sin ansiedad'
          },
          {
            id: 'sin_somnolencia',
            nombre: 'Sin somnolencia'
          },
          {
            id: 'sin_disnea',
            nombre: 'Sin disnea'
          },
          {
            id: 'buen_apetito',
            nombre: 'Buen apetito'
          },
          {
            id: 'maximo_bienestar',
            nombre: 'Maximo bienestar'
          },
          {
            id: 'sin_dificulta_para_dormir',
            nombre: 'Sin dificulta para dormir'
          },
        ],
        valoresEdmonton: {},
        mensaje: ''
      };
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    created() {
        const datosEdmonto = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/EsasComponent');

        if (datosEdmonto) {
            this.valoresEdmonton = {...datosEdmonto};
        }
    },

    mounted() {
      this.obtenerDatosEsas();
    },

    methods: {
      validarErrores() {
        return [];
      },

      obtenerDatosEsas() {
        this.$axios.get(`historia/obtenerDatosEdmon/${this.datos.afiliado.id}`)
          .then(res => {
            Object.keys(res.data).forEach(key => {
              this.$set(this.valoresEdmonton, key, res.data[key]);
            });
            this.calcularSuma()
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al obtener los datos del esas');
          });
      },

      calcularSuma() {
        const camposAIncluir = [
          'sin_ansiedad',
          'sin_cansancio',
          'sin_dificulta_para_dormir',
          'sin_disnea',
          'sin_dolor',
          'sin_nauseas',
          'sin_somnolencia',
          'sin_tristeza'
        ];
        const suma = camposAIncluir.reduce((acc, key) => {
          const value = Number(this.valoresEdmonton[key]); // Convertir a número
          return acc + (isNaN(value) ? 0 : value); // Sumar solo si es un número
        }, 0);
        //Imprimir mensaje de acuerdo a la suma
        if (suma >= 0 && suma < 30) {
          this.mensaje =
            'Síntoma leve o bien controlado. Los síntomas son mínimos y no afectan de manera significativa la calidad de vida del paciente.';
        } else if (suma >= 30 && suma < 60) {
          this.mensaje =
            'Síntoma moderado. Los síntomas son lo suficientemente intensos como para interferir en las actividades diarias o el bienestar general del paciente.';
        } else if (suma >= 60) {
          this.mensaje = 'Síntomas severos.';
        } else {
          this.mensaje = '';
        }
      },
      obtenerDatos() {
                const data = {
                   ...this.valoresEdmonton,
                  resultado_esas: this.mensaje
                }
                return {
                    datos: data
                };
            },
            validarErrores() {
            const campos = { ...this.valoresEdmonton };

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.form.validate();
        },
    },
  };

</script>

<style lang="scss" scoped>
</style>
