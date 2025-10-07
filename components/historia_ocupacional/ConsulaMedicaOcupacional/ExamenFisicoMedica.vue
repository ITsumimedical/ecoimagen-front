<template>
  <div>
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">EXAMEN FISICO
    </v-alert>
    <v-layout row wrap>
        <v-col cols="12" sm="12">
        <v-textarea outlined auto-grow label="CONDICIONES GENERALES" v-model="examenFisico.condiciones_generales"></v-textarea>
      </v-col>
     <v-col cols="12" sm="2">
        <v-select v-model="examenFisico.dominancia_motora" :items="motora" label="DOMINANCIA MOTORA">
        </v-select>
      </v-col>
     <v-col cols="12" sm="2">
        <v-text-field label="TALLA" type="number" @change="totalIMC" min="0" v-model="examenFisico.talla">
        </v-text-field>
      </v-col>
     <v-col cols="12" sm="2">
        <v-text-field label="PESO" type="number" @change="totalIMC" min="0" v-model="examenFisico.peso">
        </v-text-field>
      </v-col>
     <v-col cols="12" sm="2">
        <v-text-field label="IMC" v-model="examenFisico.imc" readonly>
        </v-text-field>
      </v-col>
     <v-col cols="12" sm="2">
        <v-text-field label="FC" v-model="examenFisico.f_c">
        </v-text-field>
      </v-col>
     <v-col cols="12" sm="2">
        <v-text-field label="FR" v-model="examenFisico.f_r">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field type="number" label="perimetro abdominal" v-model="examenFisico.perimetroabdominal">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="Presión / Sistólica" value type="number" v-model="examenFisico.presionsistolica">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="Presión / Diastólica" value type="number"
          v-model="examenFisico.presiondiastolica"></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="Presión Arterial Media" value v-model="examenFisico.presionarterialmedia"
          readonly></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="TA" v-model="examenFisico.t">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="CABEZA" v-model="examenFisico.cabeza">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="OJOS" v-model="examenFisico.ojos">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="FONDO DE OJOS" v-model="examenFisico.fondo_de_ojos">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="OIDOS" v-model="examenFisico.oidos">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="OTOSCOPIA" v-model="examenFisico.otoscopia">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="NARIZ" v-model="examenFisico.nariz">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="BOCA" v-model="examenFisico.boca">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="DENTADURA" v-model="examenFisico.dentadura">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="FARINGE" v-model="examenFisico.faringe">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="CUELLO" v-model="examenFisico.cuello">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="MAMAS" v-model="examenFisico.mamas">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="TORAX" v-model="examenFisico.torax">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="CORAZON" v-model="examenFisico.corazon">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="PULMONES" v-model="examenFisico.pulmones">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="COLUMNA" v-model="examenFisico.columna">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="ABDOMEN" v-model="examenFisico.abdomen">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="GENITALES EXTERNOS" v-model="examenFisico.genitales_externos">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="MIEMBROS SUPERIORES" v-model="examenFisico.miembros_sup">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="MIEMBROS INFERIORES" v-model="examenFisico.miembros_inf">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="REFLEJOS" v-model="examenFisico.reflejos">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="MOTILIDAD" v-model="examenFisico.motilidad">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="FUERZA MUSCULAR" v-model="examenFisico.fuerza_muscular">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="MARCHA" v-model="examenFisico.marcha">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field label="PIEL Y FRANELAS" v-model="examenFisico.piel_faneras">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-textarea auto-grow outlined label="AMPLIACIÓN DE HALLAZGOS" hint="Hint text"
          v-model="examenFisico.ampliacion_hallazgos">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" dark small @click="guardarExamenFisico()">Guardar</v-btn>
        </v-card-actions>
      </v-col>
    </v-layout>
  </div>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object,
      ocupacional: Array,
      tipoConsultaOcupacional: Object
    },
    created() {
      // this.fetchOcupacionale();
      // this.fetchSecretaria();
    },
    data() {
      return {
        motora: ['Derecha', 'Izquierda', 'Ambidiestro'],
        refiere: ['Refiere', 'No refiere'],
        si_no: ['SI', 'NO'],
        secretarias: [],
        examenFisico: {
          condiciones_generales: '',
          dominancia_motora: '',
          talla: '',
          peso: '',
          f_c: '',
          f_r: '',
          imc: '',
          perimetroabdominal: '',
          presionsistolica: '',
          presiondiastolica: '',
          presionarterialmedia: '',
          t: '',
          cabeza: '',
          ojos: '',
          fondo_de_ojos: '',
          oidos: '',
          otoscopia: '',
          nariz: '',
          boca: '',
          dentadura: '',
          faringe: '',
          cuello: '',
          mamas: '',
          torax: '',
          corazon: '',
          pulmones: '',
          columna: '',
          abdomen: '',
          genitales_externos: '',
          miembros_sup: '',
          miembros_inf: '',
          reflejos: '',
          motilidad: '',
          fuerza_muscular: '',
          marcha: '',
          piel_faneras: '',
          ampliacion_hallazgos: '',
        }
      }
    },
    watch: {
      "examenFisico.presionsistolica": function () {
        this.calcularMediaPresion();
      },
      "examenFisico.presiondiastolica": function () {
        this.calcularMediaPresion();
      }
    },

    methods: {
      totalIMC() {
          let p = Number(this.examenFisico.peso) / Math.pow(this.examenFisico.talla / 100, 2);
          this.examenFisico.imc = parseFloat(p).toFixed(1);
      },
      calcularMediaPresion() {
          this.examenFisico.presionarterialmedia =
              (parseInt(this.examenFisico.presiondiastolica) * 2 +
                  parseInt(this.examenFisico.presionsistolica)) /
              3;
          this.examenFisico.presionarterialmedia = Number.parseFloat(
              this.examenFisico.presionarterialmedia
          ).toFixed(1);
      },
      guardarExamenFisico() {
          let clasificacionPresion = "Normal";

          if (
              this.examenFisico.presionsistolica > 180 ||
              this.examenFisico.presiondiastolica > 120
          ) {
              clasificacionPresion = "CRISIS DE HIPERTENSION";
          } else if (
              this.examenFisico.presionsistolica >= 140 ||
              this.examenFisico.presiondiastolica >= 90
          ) {
              clasificacionPresion = "PRESION ARTERIAL ALTA (NIVEL 2)";
          } else if (
              this.examenFisico.presionsistolica >= 130 ||
              this.examenFisico.presiondiastolica >= 80
          ) {
              clasificacionPresion = "PRESION ARTERIAL ALTA (NIVEL 1)";
          } else if (
              this.examenFisico.presionsistolica >= 120 &&
              this.examenFisico.presiondiastolica < 80
          ) {
              clasificacionPresion = "ELEVADA";
          } else if (
              this.examenFisico.presionsistolica < 120 &&
              this.examenFisico.presiondiastolica < 80
          ) {
              clasificacionPresion = "NORMAL";
          }
          this.examenFisico.consulta_id = this.tipoConsultaOcupacional['id_CONSULTA']
          this.$axios.post('/historia_ocupacional/examenFisico/', this.examenFisico).then((res) => {
              return console.log('datos', res.data);
              this.$emit('respuestaComponente')
          })
      },
      // async fetchOcupacionale() {
      //     const general = await axios.post('/api/cita/getSaludocupacional/' + this.datosCita
      //         .cita_paciente_id);
      //     this.medicoSaludOcupacional = general.data;
      //     if (this.medicoSaludOcupacional.condiciones_generales == null) {
      //         this.medicoSaludOcupacional.condiciones_generales = 'Normal'
      //     }
      //     if (this.medicoSaludOcupacional.cabeza == null) {
      //         this.medicoSaludOcupacional.cabeza = 'Normal'
      //     }
      //     if (this.medicoSaludOcupacional.ojos == null) {
      //         this.medicoSaludOcupacional.ojos = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.fondo_de_ojos == null) {
      //         this.medicoSaludOcupacional.fondo_de_ojos = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.oidos == null) {
      //         this.medicoSaludOcupacional.oidos = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.otoscopia == null) {
      //         this.medicoSaludOcupacional.otoscopia = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.nariz == null) {
      //         this.medicoSaludOcupacional.nariz = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.boca == null) {
      //         this.medicoSaludOcupacional.boca = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.dentadura == null) {
      //         this.medicoSaludOcupacional.dentadura = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.faringe == null) {
      //         this.medicoSaludOcupacional.faringe = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.cuello == null) {
      //         this.medicoSaludOcupacional.cuello = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.mamas == null) {
      //         this.medicoSaludOcupacional.mamas = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.torax == null) {
      //         this.medicoSaludOcupacional.torax = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.corazon == null) {
      //         this.medicoSaludOcupacional.corazon = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.pulmones == null) {
      //         this.medicoSaludOcupacional.pulmones = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.columna == null) {
      //         this.medicoSaludOcupacional.columna = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.abdomen == null) {
      //         this.medicoSaludOcupacional.abdomen = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.genitales_externos == null) {
      //         this.medicoSaludOcupacional.genitales_externos = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.miembros_sup == null) {
      //         this.medicoSaludOcupacional.miembros_sup = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.miembros_inf == null) {
      //         this.medicoSaludOcupacional.miembros_inf = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.reflejos == null) {
      //         this.medicoSaludOcupacional.reflejos = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.motilidad == null) {
      //         this.medicoSaludOcupacional.motilidad = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.fuerza_muscular == null) {
      //         this.medicoSaludOcupacional.fuerza_muscular = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.marcha == null) {
      //         this.medicoSaludOcupacional.marcha = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.piel_faneras == null) {
      //         this.medicoSaludOcupacional.piel_faneras = 'Normal'
      //     }

      //     if (this.medicoSaludOcupacional.ampliacion_hallazgos == null) {
      //         this.medicoSaludOcupacional.ampliacion_hallazgos = 'Normal'                
      //     }

      // },
      // fetchSecretaria() {
      //     axios.get('/api/municipio/secretaria')
      //         .then(res => {
      //             this.secretarias = res.data
      //         })
      // },
    }
  }

</script>
<style lang="scss" scoped>
  #signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

</style>
