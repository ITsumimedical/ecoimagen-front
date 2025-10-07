<template>
  <div>
    <v-alert text dense color="blue" border="left" class="text-center" icon="mdi-human-male-height"><b>VALORACIÓN ANTROPOMÉTRICA</b></v-alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Registre el peso anterior del afiliado en kg" dense outlined type="number"
            v-model="valoracion.peso_anterior" :rules="campoRequerido">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Fecha del registro" dense outlined type="date"
            v-model="valoracion.fecha_registro_peso_anterior" :rules="campoRequerido" :max="hoy">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Registre el peso actual en Kg" dense outlined type="number"
            v-model="valoracion.peso_actual" :rules="campoRequerido">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Registre la talla actual en centímetros" dense outlined type="number"
            v-model="valoracion.altura_actual" :rules="campoRequerido">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Indice de masa corporal" readonly dense outlined type="number" v-model="valoracion.imc" :rules="campoRequerido">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Clasificación" readonly dense outlined v-model="valoracion.clasificacion" :rules="campoRequerido">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Perimetro braquial en centimetros" dense outlined type="number" :rules="campoRequerido"
            v-model="valoracion.perimetro_braquial">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Pliegue de grasa tricipital en milimetros" dense outlined type="number" :rules="campoRequerido"
            v-model="valoracion.pliegue_grasa_tricipital">
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Pliegue de grasa subescapular en milimetros" dense outlined type="number" :rules="campoRequerido"
            v-model="valoracion.pliegue_grasa_subescapular">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Peso/Talla o longitud(Peso adecuado para la talla)" dense outlined :rules="campoRequerido"
            v-model="valoracion.peso_talla">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Talla o longitud para la edad" dense outlined :rules="campoRequerido"
            v-model="valoracion.longitud_talla">
          </v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos'],
    data() {
      return {
        valoracion: {
          peso_anterior: '',
          fecha_registro_peso_anterior: '',
          peso_actual: '',
          altura_actual: '',
          imc: '',
          clasificacion: '',
          perimetro_braquial: '',
          pliegue_grasa_tricipital: '',
          pliegue_grasa_subescapular: '',
          peso_talla: '',
          longitud_talla: '',
          consulta_id: this.datos.id
        },
        loading: false,
        valid: true,
        hoy: this.$moment().format("YYYY-MM-DD"),
        campoRequerido: [
        v => !!v || 'Este campo es requerido',
      ],
      }
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    mounted() {
        const datosValoracion = this.obtenerDatosPorConsulta(this.datos.id, 'valoracionAntropometrica/Model/ValoracionAntropometrica', 'historia/formularios/valoracionAntropometrica');

        if (datosValoracion) {
            this.valoracion = {...datosValoracion}
        }
	},

    watch: {
      'valoracion.peso_actual': 'calcularIMC',
      'valoracion.altura_actual': 'calcularIMC',
    },

    methods: {
      calcularIMC() {
        const peso = parseFloat(this.valoracion.peso_actual);
        const alturaCm = parseFloat(this.valoracion.altura_actual);

        if (peso && alturaCm) {
          const alturaM = alturaCm / 100; // Convertir a metros
          this.valoracion.imc = (peso / (alturaM * alturaM)).toFixed(2);

          // Clasificación según el IMC
          if (this.valoracion.imc < 18.5) {
            this.valoracion.clasificacion = 'Bajo peso';
          } else if (this.valoracion.imc >= 18.5 && this.valoracion.imc < 24.9) {
            this.valoracion.clasificacion = 'Peso normal';
          } else if (this.valoracion.imc >= 25 && this.valoracion.imc < 29.9) {
            this.valoracion.clasificacion = 'Sobrepeso';
          } else {
            this.valoracion.clasificacion = 'Obesidad';
          }
        } else {
          this.valoracion.imc = '';
          this.valoracion.clasificacion = 'Datos incompletos';
        }
      },

      // guardarValoracion() {
      //   if(!this.$refs.form.validate()) {
      //     return this.$toast.error('Campos requeridos sin diligenciar')
      //   }
      //   this.loading = true;
      //   this.$axios.post('valoracionesAntropometricas/crear', this.valoracion).then(() => {
      //     this.$toast.success('Guardado con exito')
      //   }).catch((error) => {
      //     console.log(error)
      //   }).finally(() => {
      //     this.loading = false;
      //   })
      // },

      cargarDatos() {
        this.$axios.get(`valoracionesAntropometricas/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.valoracion = {
            ...this.valoracion,
            ...res.data
          }
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },
      obtenerDatos() {
                const datosValor = {
                   ...this.valoracion
                }
                return {
                    datos: datosValor
                };
            },
    }
  }

</script>
