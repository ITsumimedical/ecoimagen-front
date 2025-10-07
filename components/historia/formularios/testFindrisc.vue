<template>
  <div>
    <v-col cols="12" sm="12" md="12">
      <v-alert text dense color="info" border="left" class="text-center" icon="mdi-information"><b>TEST DE FINDRISC</b>
      </v-alert>
    </v-col>
    <v-card-text>
      <v-form ref="findriscForm" lazy-validation>
        <div v-if="diabetesConsulta == false">
          <v-row>
            <v-col cols="12" md="3" sm="3">
              <v-text-field label="Sexo" readonly v-model="this.datos.afiliado.sexo" dense outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <v-text-field label="Edad" v-model="this.datos.afiliado.edad_cumplida" dense outlined readonly>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <v-text-field label="IMC" dense :value="findrisc.imc" outlined type="number" readonly :rules="reglas">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <v-text-field label="Perimetro abdominal" :value="findrisc.perimetro_abdominal" dense outlined
                type="number" readonly>
              </v-text-field>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12" sm="4" md="4">
              <v-card-title style="font-size: 17px;"><b>¿Realiza ejercicio habitualmente?</b></v-card-title>
              <v-radio-group v-model="actividad_fisica" row :rules="reglas">
                <v-radio label="Si" value="Si"></v-radio>
                <v-radio label="No" value="No"></v-radio>
              </v-radio-group>
            </v-col>
            <v-divider inset vertical></v-divider>
            <v-col cols="12" sm="4" md="4">
              <v-card-title style="font-size: 17px;"><b>¿Come a diario frutas o verduras?</b></v-card-title>
              <v-radio-group v-model="frutas_verduras" row :rules="reglas2">
                <v-radio label="Si" :value="1"></v-radio>
                <v-radio label="No" :value="0"></v-radio>
              </v-radio-group>
            </v-col>
            <v-divider inset vertical></v-divider>
            <v-col cols="12" sm="4" md="4">
              <v-card-title style="font-size: 17px;"><b>¿Toma medicación para la hipertensión regularmente?</b>
              </v-card-title>
              <v-radio-group v-model="hipertension" row :rules="reglas">
                <v-radio label="Si" value="Si"></v-radio>
                <v-radio label="No" value="No"></v-radio>
              </v-radio-group>
            </v-col>
            <v-divider></v-divider>

            <v-col cols="12" sm="4" md="4">
              <v-card-title style="font-size: 17px;"><b>¿Le han encontrado alguna vez valores de glucemia altos?</b>
              </v-card-title>
              <v-radio-group v-model="glucosa" row :rules="reglas">
                <v-radio label="Si" value="Si"></v-radio>
                <v-radio label="No" value="No"></v-radio>
              </v-radio-group>
            </v-col>
            <v-divider inset vertical></v-divider>

            <v-col cols="12" sm="6" md="6">
              <v-card-title style="font-size: 17px;"><b>¿Algún familiar está diagnosticado de diabetes (tipo I o tipo
                  II)?</b></v-card-title>
              <v-radio-group v-model="diabetes" row :rules="reglas">
                <v-radio label="No" value="No"></v-radio>
                <v-radio label="Si (Abuelos, tios, primos)" value="Si (Abuelos, tios, primos)"></v-radio>
                <v-radio label="Si (Padres, hermanos, hijos)" value="Si (Padres, hermanos, hijos)"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-col cols="12" sm="12" md="12" v-if="puntaje > 0 && actividad_fisica && actividad_fisica.length > 0">
            <v-alert color="warning" text dense border="left" icon="mdi-alert">Puntaje: <b>{{ puntaje }}</b> - Riesgo de
              desarrollar diabetes: <b>{{ riesgo }}</b>
            </v-alert>
          </v-col>
        </div>
        <div v-else>
          <v-divider></v-divider>
          <v-col></v-col>
          <v-alert text dense color="error" border="left" class="text-center" icon="mdi-information">
            <b>No aplica - Usuario con antecedente de diabetes.</b><br>
          </v-alert>
          <v-divider></v-divider>
          <v-col></v-col>
        </div>
      </v-form>
    </v-card-text>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex';

export default {
  props: ['datos'],
  data() {
    return {
      afiliado_id: this.datos.afiliado.id,
      diabetesConsulta: false,
      actividad_fisica: '',
      frutas_verduras: null,
      hipertension: '',
      glucosa: '',
      diabetes: '',
      puntaje: 0,
      riesgo: '',
      reglas: [
        v => Array.isArray(v) ? v.length > 0 && v !== null && v !== undefined || 'Campo requerido' : !!v || 'Campo requerido'
      ],
      reglas2: [
        v => v === 0 || v === 1 ? true : 'Campo requerido'
      ],

      valid: false,
    }
  },
  mounted() {
    this.obtenerDatosFindrisc(),
      this.obtenerDatosDiabetes()
  },
  watch: {
    actividad_fisica: 'verificarYCalcularFindrisc',
    frutas_verduras: 'verificarYCalcularFindrisc',
    hipertension: 'verificarYCalcularFindrisc',
    glucosa: 'verificarYCalcularFindrisc',
    diabetes: 'verificarYCalcularFindrisc',
  },

  computed: {
    ...mapGetters('medidas', ['findrisc'])
  },


  methods: {
    ...mapActions('medidas', ['updateExamenF']),

    verificarYCalcularFindrisc() {
      // Solo calcular si todos los campos están diligenciados
      if (
        this.actividad_fisica &&
        this.frutas_verduras !== '' &&
        this.hipertension &&
        this.glucosa &&
        this.diabetes
      ) {
        const resultado = this.calcularFindrisc();
        this.puntaje = resultado.puntaje;
        this.riesgo = resultado.riesgo;
      }
    },
    obtenerDatos() {
      let data = {}
      if (this.diabetesConsulta === false) {
        data = {
          actividad_fisica: this.actividad_fisica,
          frutas_verduras: this.frutas_verduras,
          hipertension: this.hipertension,
          glucosa: this.glucosa,
          diabetes: this.diabetes,
          edad_puntaje: this.datos.afiliado.edad_cumplida,
          indice_corporal: this.findrisc.imc,
          consulta_id: this.datos.id,
          perimetro_abdominal: this.findrisc.perimetro_abdominal,
          resultado: this.puntaje + ' - ' + this.riesgo,
          estado_id: 1
        };
      } else {
        data = {
          actividad_fisica: null,
          frutas_verduras: null,
          hipertension: null,
          glucosa: null,
          diabetes: null,
          edad_puntaje: null,
          indice_corporal: null,
          consulta_id: null,
          perimetro_abdominal: null,
          resultado: null,
          estado_id: null
        };
      }
      return {
        datos: data
      };
    },


    obtenerDatosFindrisc() {
      this.$axios.post('estratificacion-findrisks/listarEstratificacion/', { consulta_id: this.datos.id })
        .then(res => {
          this.actividad_fisica = res.data.actividad_fisica || [];
          this.frutas_verduras = res.data.frutas_verduras || [];
          this.hipertension = res.data.hipertension || [];
          this.glucosa = res.data.glucosa || [];
          this.diabetes = res.data.diabetes || [];
          const resultado = this.calcularFindrisc();
          this.puntaje = resultado.puntaje;
          this.riesgo = resultado.riesgo;
        })
        .catch(error => {
          console.error("Error al obtener los datos:", error);
        });
    },

    validarErrores() {
      return this.$refs.findriscForm.validate();
    },

    calcularFindrisc() {
      let puntaje = 0;
      const edad = this.datos.afiliado.edad_cumplida;
      if (edad >= 45 && edad <= 54) puntaje += 2;
      else if (edad >= 55 && edad <= 64) puntaje += 3;
      else if (edad >= 65) puntaje += 4;

      const imc = this.findrisc.imc;
      if (imc >= 25 && imc <= 30) puntaje += 1;
      else if (imc > 30) puntaje += 3;

      const perimetro = this.findrisc.perimetro_abdominal;
      if (this.datos.afiliado.sexo === 'M') {
        if (perimetro >= 94 && perimetro <= 102) puntaje += 3;
        else if (perimetro > 102) puntaje += 4;
      } else if (this.datos.afiliado.sexo === 'F') {
        if (perimetro >= 80 && perimetro <= 88) puntaje += 3;
        else if (perimetro > 88) puntaje += 4;
      }

      if (this.actividad_fisica === 'No') puntaje += 2;

      if (this.frutas_verduras === 'No') puntaje += 1;

      if (this.hipertension === 'Si') puntaje += 2;

      if (this.glucosa === 'Si') puntaje += 5;

      if (this.diabetes === 'Si (Padres, hermanos, hijos)') puntaje += 3;
      else if (this.diabetes === 'Si (Abuelos, tios, primos)') puntaje += 5;

      let riesgo;
      if (puntaje < 7) {
        riesgo = 'Bajo';
      } else if (puntaje >= 7 && puntaje <= 11) {
        riesgo = 'Moderado';
      } else {
        riesgo = 'Alto';
      }
      return {
        puntaje,
        riesgo
      };
    },
    obtenerDatosDiabetes() {
      let afiliado_id = this.datos.afiliado.id;
      this.$axios.get(`/antecedentes-personales/obtenerDiabetes/${afiliado_id}`)
        .then((res) => {
          this.diabetesConsulta = res.data;
        })
        .catch((err) => {
          return this.$toast.error("Error al generar información de diabetes");
        })
    },
  }
}

</script>
