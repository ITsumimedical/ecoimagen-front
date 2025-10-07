<template>
  <div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <v-card>
      <v-alert dense text border="left" color="primary" icon="mdi-note-search-outline" class="text-center">Auditoría de agendas</v-alert>
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" sm="3" md="3">
            <v-text-field dense v-model="formReporte.fechaDesde" type="date" label="Fecha Desde"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field dense v-model="formReporte.fechaHasta" type="date" label="Fecha Hasta"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete v-model="formReporte.medico" outlined dense :search-input.sync="funcionario"
              no-data-text="Digite el nombre del médico para iniciar la búsqueda" :items="medicosActivos"
              item-text="nombre" item-value="id" label="Selecciona el medico">
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="warning" @click="auditoriaAgendas()">Exportar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
  export default {
    name: 'AgendamientoReportes',
    watch: {
      funcionario(val) {
        if (val && val.length === 6) {
          this.funcionarios();
        } else {
          // this.medicosActivos = null;
        }
      }
    },
    mounted() {

    },
    data() {
      return {
        preload: false,
        medicosActivos: [],
        formReporte: {
          fechaDesde: null,
          fechaHasta: null,
          medico: null
        },
        funcionario: null,
      }
    },
    methods: {
      auditoriaAgendas() {
        this.preload = true;
        if (!this.formReporte.fechaDesde) {
          this.preload = false;
          return this.$toast.error('El campo "Fecha Desde" es requerido.')
        }
        if (!this.formReporte.fechaHasta) {
          this.preload = false;
          return this.$toast.error('El campo "Fecha Hasta" es requerido.')
        }
        if (!this.formReporte.medico) {
          this.preload = false;
          return this.$toast.error('El campo "Medico" es requerido.')
        }
        this.$axios.post('agenda/auditoria-agendas', this.formReporte, {
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.download = 'AuditoriaAgendas' + this.formReporte.fechaDesde + '/' + this.formReporte.fechaHasta +
            '.xlsx';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.preload = false;
        }).catch(err => {
          this.preload = false;
          console.log(err)
        })
      },
      funcionarios() {
        this.preload = true
        this.$axios.post('usuarios/listarConfiltro?page=0', {
          funcionario: this.funcionario
        }).then(res => {
          this.preload = false
          if (res.data.length >= 2) {
            this.medicosActivos = res.data.map((funcionario) => {
              return {
                id: funcionario.id,
                nombre: `${funcionario.nombre_completo}`,
              }
            })
          } else if (res.data.length == 1) {
            this.funcionarios = res.data.map((funcionario) => {
              return {
                id: funcionario.id,
                nombre: `${funcionario.nombre}`,
              }
            })
          }
        }).catch(e => {
          this.preload = false;
          console.log(e);
        })
      },
    }
  }

</script>
