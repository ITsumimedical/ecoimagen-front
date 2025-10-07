<template>
  <div>
    <v-container>
      <v-row>
        <v-col xs="12" sm="12" md="12">
          <v-alert border="left" class="text-center" dense text prominent type="info" icon="mdi-human-male-height">
            <b>EXAMÉN FISICO</b>
          </v-alert>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>CARA Y CUELLO</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la asimetria de cara y cuello del paciente" label="Asímetria" auto-grow
            v-model="examen_fisico.asimetria">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="¿El paciente posee lunares,manchas o tatuajes?" label="Lunares,manchas,tatuajes"
            auto-grow v-model="examen_fisico.lunares_manchas_tatuajes">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el aumento de volúmen del paciente" label="Aumento de volúmen" auto-grow
            v-model="examen_fisico.aumento_volumen">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa los ganglios linfáticos del paciente" label="ganglios linfaticos"
            auto-grow v-model="examen_fisico.ganglios_linfaticos">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa los senos maxilares del paciente" label="Senos maxilares" auto-grow
            v-model="examen_fisico.senos_maxilares">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>EXAMÉN DE ARTICULACIÓN TEMPOROMANDIBULAR</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente genera ruido o chasqueo o en la dentadura" label="Ruidos"
            auto-grow v-model="examen_fisico.ruidos">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente genera ruido o chasqueo o en la dentadura"
            label="Chasquidos" auto-grow v-model="examen_fisico.chasquidos">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente genera un sonido crujiente" label="Crepitaciones" auto-grow
            v-model="examen_fisico.crepitaciones">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente tiene disfunción de la articulación temporomandibular"
            label="Bloqueo mandibular" auto-grow v-model="examen_fisico.bloqueo_mandibular">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el dolor que siente el paciente" label="Dolor" auto-grow
            v-model="examen_fisico.dolor">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la apertura y cierre de la articulación temporomandibular"
            label="Apertura y cierre" auto-grow v-model="examen_fisico.apertura_cierre">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>EXÁMEN ESTOMATOLOGICO</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el labio inferior del paciente" label="Labio inferior" auto-grow
            v-model="examen_fisico.labio_inferior">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el labio superior del paciente" label="Labio superior" auto-grow
            v-model="examen_fisico.labio_superior">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la comisura de los labios" label="Comisuras" auto-grow
            v-model="examen_fisico.comisuras">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describe la mucosa oral del paciente" label="Mucosa oral" auto-grow
            v-model="examen_fisico.mucosa_oral">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa los carrillos o mejillas del paciente" label="Carrillos" auto-grow
            v-model="examen_fisico.carrillos">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el revestimiento interno de las mejillas" label="Surcos yugales" auto-grow
            v-model="examen_fisico.surcos_yugales">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el frenillo labial del paciente" label="Frenillos" auto-grow
            v-model="examen_fisico.frenillos">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el orofaringe o bucofaringe del paciente" label="Orofaringe" auto-grow
            v-model="examen_fisico.orofaringe">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la parte interior y superior de la boca del paciente" label="Paladar"
            auto-grow v-model="examen_fisico.paladar">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Escriba aqui la descripción" label="Glándulas salivales" auto-grow
            v-model="examen_fisico.glandulas_salivares">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el piso de la boca  aquí" label="Piso de boca" auto-grow
            v-model="examen_fisico.piso_boca">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la parte superior de la lengua" label="Dorso de la lengua" auto-grow
            v-model="examen_fisico.dorso_lengua">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Escriba la descripcion del vientre de la lengua del paciente"
            label="Vientre de la lengua" auto-grow v-model="examen_fisico.vientre_lengua">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el estado de los musculos masticadores del paciente"
            label="Musculos masticadores" auto-grow v-model="examen_fisico.musculos_masticadores">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el riesgo de caidas de los dientes del paciente" label="Riesgo de caídas"
            auto-grow v-model="examen_fisico.riesgo_caidas">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Escriba aquí una descripcion que requiera necesaria" label="Otros" auto-grow
            v-model="examen_fisico.otros">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>EXÁMEN FUNCIONAL</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Escriba aquí la descripción" label="Masticación" auto-grow
            v-model="examen_fisico.masticacion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa el proceso de deglución" label="Deglución" auto-grow
            v-model="examen_fisico.deglucion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined label="Habla" auto-grow v-model="examen_fisico.habla">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa la emision de la voz o de la palabra del paciente" label="Fonacion"
            auto-grow v-model="examen_fisico.fonacion">
          </v-textarea>
        </v-col>
        <v-col md="12">
          <v-alert border="left" class="text-center" dense text color="blue-grey">
            <b>OCLUSIÓN</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="4" md="3">
          <v-autocomplete dense outlined :items="molares" label="Relaciones molares" auto-grow
            v-model="examen_fisico.relaciones_molares">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-autocomplete :items="molares" outlined label="Relaciones caninas" auto-grow
            v-model="examen_fisico.relaciones_caninas" dense>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-autocomplete dense outlined :items="interdental" label="Relación intendental" auto-grow
            v-model="examen_fisico.relacion_interdental">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-autocomplete dense outlined :items="oclusion" label="Tipo de oclusión" auto-grow
            v-model="examen_fisico.tipo_oclusion">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined
            hint="Describa si el paciente posee problemas de posicionamiento y alineacion de los dientes"
            label="Apiñamiento" auto-grow v-model="examen_fisico.apiñamiento">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined
            hint="Describa si el paciente posee alguna alteracion facial que imposibilite cerrar los dientes frontales o posteriores"
            label="Mordida abierta" auto-grow v-model="examen_fisico.mordida_abierta">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente posee problemas de maloclusión" label="Mordida profunda"
            auto-grow v-model="examen_fisico.mordida_profunda">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined hint="Describa si el paciente posee problemas de maloclusión" label="Mordida cruzada"
            auto-grow v-model="examen_fisico.mordida_cruzada">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-textarea outlined
            hint="Describa la diferencia entre el espacio y el espacio requerido para la total erupción dental"
            label="Discrepancias óseas" auto-grow v-model="examen_fisico.discrepancias_oseas">
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
        examen_fisico: {
          asimetria: '',
          lunares_manchas_tatuajes: '',
          aumento_volumen: '',
          ganglios_linfaticos: '',
          senos_maxilares: '',
          ruidos: '',
          chasquidos: '',
          crepitaciones: '',
          bloqueo_mandibular: '',
          dolor: '',
          apertura_cierre: '',
          labio_inferior: '',
          labio_superior: '',
          comisuras: '',
          mucosa_oral: '',
          carrillos: '',
          surcos_yugales: '',
          frenillos: '',
          orofaringe: '',
          paladar: '',
          glandulas_salivares: '',
          piso_boca: '',
          dorso_lengua: '',
          vientre_lengua: '',
          musculos_masticadores: '',
          riesgo_caidas: '',
          otros: '',
          masticacion: '',
          deglucion: '',
          habla: '',
          fonacion: '',
          relaciones_molares: '',
          relaciones_caninas: '',
          relacion_interdental: '',
          tipo_oclusion: '',
          apiñamiento: '',
          mordida_abierta: '',
          mordida_profunda: '',
          mordida_cruzada: '',
          discrepancias_oseas: '',
        },
        molares: ['Clase I', 'Clase II', 'Clase III', 'No se puede determinar'],
        interdental: ['Diente-Diente', 'Diente-dos dientes', 'No se puede determinar'],
        oclusion: ['Normoclusion', 'Mesoclusión', 'Distoclusión'],
        loading: false,
      }
    },
    created() {
        const examenFisicoOdontologia = this.obtenerDatosPorConsulta(this.datos.id, 'ExamenFisicoOdontologia/Model/examenFisicoOdontologia', 'historia/formularios/examenFisicoOdontologia');

        if (examenFisicoOdontologia) {
            this.examen_fisico = { ...examenFisicoOdontologia }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
            return {
                    datos: this.examen_fisico
                };
        }

      // limpiarData() {
      //   for (let key in this.examen_fisico) {
      //     this.examen_fisico[key] = '';
      //   }
      // }
    }
  }

</script>
