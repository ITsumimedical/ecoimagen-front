<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="12" sm="12">
        <v-alert text dense color="info" icon="mdi-escalator" border="left"><b>ESCALA KAISER</b></v-alert>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-autocomplete label="Nivel Kaiser" outlined dense :items="niveles" v-model="kaiser.nivel_kaiser"  @change="descripcionKaiserNivel(kaiser.nivel_kaiser)">
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-textarea label="Descripción" dense auto-grow outlined v-model="kaiser.descripcion_kaiser"></v-textarea>
      </v-col>
    </v-row>
    <v-card-actions class="justify-center">
      <v-btn color="success" small @click="crearKaiser()">Agregar nivel kaiser</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  export default {
    props: ['consulta'],
    data() {
      return {
        niveles: [0, 1, 2, 3],
        kaiser: {
          nivel_kaiser: '',
          descripcion_kaiser: '',
        }
      }
    },
    mounted() {
      this.cargarDatos();
    },
    methods: {
      cargarDatos() {
        this.$axios.get(`nivelKaiser/obtenerDatos/${this.consulta.afiliado.id}`).then(res => {
          if (res.data) {
            this.kaiser = res.data;
          }
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },
      crearKaiser() {
        const data = {
          nivel_kaiser: this.kaiser.nivel_kaiser,
          descripcion_kaiser: this.kaiser.descripcion_kaiser,
          consulta_id: this.consulta.id,
          afiliado_id: this.consulta.afiliado.id
        };
        this.$axios.post('nivelKaiser/crear', data).then(res => {
          this.$toast.success('Agregado con éxito');
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al agregar');
        });
      },

      descripcionKaiserNivel($nivel) {
        switch ($nivel) {
          case 0:
            this.kaiser.descripcion_kaiser =
              'Incentivar el autocuidado de su salud y asistencia a Programas de promoción y mantenimiento de la salud según ciclo de vida. Derivar si detecta que no se encuentra captado.';
            break;
          case 1:
            this.kaiser.descripcion_kaiser =
              'Incentivar la autogestión, autocuidado y asistencia a Programas de Gestión integral del Riesgo en centros de Atención Primaria Avanzada. Derivar si detecta que no se encuentra captado.';
            break;
          case 2:
            this.kaiser.descripcion_kaiser =
              'Incentive el automanejo, autocuidado y asistencia a los programas de gestión de la enfermedad verticalizados en los centros de Atención Primaria Avanzada, motive el rol de “Paciente y/o cuidador Experto”. Derivar si detecta que no se encuentra captado.';
            break;
          case 3:
            this.kaiser.descripcion_kaiser =
              'Incentive el automanejo, autocuidado y asistencia a los programas verticalizados de Gestión integral del Riesgo en centros de Atención Primaria Avanzada, así como al programa de gestión a Pacientes Punta pirámide institucional. Derivar si detecta que no se encuentra captado.';
            break;
        }

      },
    }
  }

</script>
