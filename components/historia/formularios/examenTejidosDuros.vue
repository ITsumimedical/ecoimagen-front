<template>
  <div>
    <v-container>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert border="left" class="text-center" dense text prominent type="info" icon="mdi-book-account">
            <b>EXAMÉN TEJIDOS DUROS</b>
          </v-alert>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>EXÁMEN PULPAR</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la sensibilidad al frío que tiene el paciente en la dentadura"
            label="Sensibilidad al frío" auto-grow v-model="tejidos_duros.sensibilidad_frio">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la sensibilidad al calor que tiene el paciente en la dentadura"
            label="Sensibilidad al calor" auto-grow v-model="tejidos_duros.sensibilidad_calor">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente presenta cambio de color" label="Cambio de color" auto-grow
            v-model="tejidos_duros.cambio_de_color">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Escriba aquí la descripción" label="Perscusión positiva" auto-grow
            v-model="tejidos_duros.percusion_positiva">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Exposicion pulpar" auto-grow v-model="tejidos_duros.exposicion_pulpar">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="otros" hint="Escriba aqui una descripcion que requiera necesaria" auto-grow
            v-model="tejidos_duros.otros">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>EXÁMEN DE TEJIDOS DENTARIOS</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="supernumerarios"
            hint="Describa si el paciente supera la cantidad de dientes normal" auto-grow
            v-model="tejidos_duros.supernumerarios">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Agenesia"
            hint="Describa si el paciente sufre de ausencia de desarrollo de uno o más dientes" auto-grow
            v-model="tejidos_duros.agenesia">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Anodoncia"
            hint="Describa si el paciente sufre la ausencia de uno o más dientes, temporales o definitivos" auto-grow
            v-model="tejidos_duros.anodoncia">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Decoloracion" hint="Escriba aqui una descripción" auto-grow
            v-model="tejidos_duros.decoloracion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Descalcificación"
            hint="Describa si el paciente sufre de reblandecimientos de los huesos" auto-grow
            v-model="tejidos_duros.descalcificacion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Facetas de desgaste" hint="Escriba aqui una descripcion que requiera necesaria"
            auto-grow v-model="tejidos_duros.facetas_desgaste">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Atrición"
            hint="Describa si el paciente tiene dientes desgastados debido a al fricción" auto-grow
            v-model="tejidos_duros.atricion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Abrasión/abfracción"
            hint="Describa si el paciente tiene desgaste mecánico no cariado de los dientes" auto-grow
            v-model="tejidos_duros.abrasion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Fluorosis" auto-grow
            v-model="tejidos_duros.fluorosis">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Prótesis fija" hint="Agregue una descripción aquí" auto-grow
            v-model="tejidos_duros.protesis_fija">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Prótesis removible" hint="Agregue una descripción aquí" auto-grow
            v-model="tejidos_duros.protesis_removible">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Prótesis total" hint="Agregue una descripción aquí" auto-grow
            v-model="tejidos_duros.protesis_total">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Implabtes dentales" hint="Describa si el paciente tiene algún implante dental"
            auto-grow v-model="tejidos_duros.implantes_dentales">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Aparatología ortopedica u ortodoncia" hint="Agregue una descripción aquí"
            auto-grow v-model="tejidos_duros.aparatologia_ortopedica">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>ALTERACIONES PERIODONTALES</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Inflamación" hint="Describa si el paciente sufre de algún tiempo de inflamación"
            auto-grow v-model="tejidos_duros.inflamacion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Sangrado" hint="Describa si el paciente sufre de algún tiempo de sangrado"
            auto-grow v-model="tejidos_duros.sangrado">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Exudado" hint="Agregue la descripción aquí" auto-grow
            v-model="tejidos_duros.exudado">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Supuración"
            hint="Describa si el paciente sufre de algún tipo de acumulacion de pus causado por infeccion" auto-grow
            v-model="tejidos_duros.supuracion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Placa blanda" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.placa_blanda">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Placa calcificada" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.placa_calcificada">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Retracciones" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.retracciones">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Presencia de bolsas" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.presencia_bolsas">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Cuellos sensibles" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.cuellos_sensibles">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Movilidad" hint="Agregue una descripción" auto-grow
            v-model="tejidos_duros.movilidad">
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos', 'resumen'],
    data() {
      return {
        tejidos_duros: {
          sensibilidad_frio: '',
          sensibilidad_calor: '',
          cambio_de_color: '',
          percusion_positiva: '',
          exposicion_pulpar: '',
          otros: '',
          supernumerarios: '',
          agenesia: '',
          anodoncia: '',
          decoloracion: '',
          descalcificacion: '',
          facetas_desgaste: '',
          atricion: '',
          abrasion: '',
          fluorosis: '',
          protesis_fija: '',
          protesis_removible: '',
          protesis_total: '',
          implantes_dentales: '',
          aparatologia_ortopedica: '',
          inflamacion: '',
          sangrado: '',
          exudado: '',
          supuracion: '',
          placa_blanda: '',
          placa_calcificada: '',
          retracciones: '',
          presencia_bolsas: '',
          cuellos_sensibles: '',
          movilidad: '',
        },
        loading:false
      }
    },
    created() {
        const tejidos = this.obtenerDatosPorConsulta(this.datos.id, 'ExamenTejidosDuros/Model/examenTejidosDuros', 'historia/formularios/examenTejidosDuros');

        if (tejidos) {
            this.tejidos_duros = { ...tejidos }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
                return {
                    datos: this.tejidos_duros
                };
            },
    }
  }

</script>
