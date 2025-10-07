<template>
  <div>
    <v-row>
      <v-col cols="12" sm="11" md="11">
        <v-textarea v-model="recomendacion" label="Descripción de las recomendaciones" outlined dense auto-grow>
        </v-textarea>
      </v-col>
      <v-col cols=12 sm="1" md="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click="agregarRecomendaciones()" :loading="loading" :disabled="loading"
              color="success" outlined small fab dark>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Añadir Recomendacion</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-col cols="12" md="12" sm="12" v-if="recomendaciones.length > 0">
      <v-alert color="info" border="left" text dense><b>Recomendaciones</b></v-alert>
    </v-col>

    <!-- Timeline para mostrar recomendaciones -->
    <v-timeline v-if="recomendaciones.length > 0" align-top :dense="$vuetify.breakpoint.smAndDown">
      <v-timeline-item v-for="(recomendacion, index) in recomendaciones" :key="index" color="info"
        icon="mdi-check-circle-outline">
        <v-card color="info" dark>
          <v-card-text class="white text--primary">
            <v-icon color="info" text left>mdi-mdi-note-check-outline</v-icon>
            {{ recomendacion.recomendaciones }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <v-col cols="12" md="12" sm="12" v-if="recomendaciones.length > 0">
      <v-alert text dense color="info" border="left"><b>Descargar recomendaciones</b></v-alert>
    </v-col>
    <v-col v-if="recomendaciones.length > 0">
      <v-btn color="success" :loading="cargando"  @click="imprimirRecomendacion(consulta, 'recomendacionesConsulta')" dark>
        Descargar
      </v-btn>
    </v-col>
  </div>
</template>

<script>
  export default {
    props: ['consulta'],
    data() {
      return {
        recomendacion: '',
        recomendaciones: [],
        loading: false,
        cargando: false
      }
    },

    mounted() {
      this.listar();
    },

    methods: {
      agregarRecomendaciones() {
        const data = {
          recomendaciones: this.recomendacion,
          consulta_id: this.consulta,
          user_registra_id: this.$store.state.auth.usuario.id,
          estado_id: 1
        };
        this.loading = true;
        this.$axios.post('recomendacionesConsulta/crear', data).then(res => {
          this.$toast.success('Creado con éxito');
          this.listar();
          this.recomendacion = '';
        }).catch(error => {
          this.$toast.error(error);
        }).finally(() => {
          this.loading = false;
        });
      },

      listar() {
        this.$axios.get('recomendacionesConsulta/listar/' + this.consulta).then(res => {
          this.recomendaciones = res.data;
        }).catch(error => {
          console.log(error);
        });
      },

      imprimirRecomendacion(id, tipo) {
        this.cargando = true;
        const data = {
          tipo: tipo,
          consulta: id,
        };
        this.$axios
          .post("pdf", data, {
            responseType: "arraybuffer",
          })
          .then((res) => {
            this.cargando = false;
            let blob = new Blob([res.data], {
              type: "application/pdf",
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            window.open(link.href, "_blank");
          })
          .catch((res) => {
            console.log(res);
            this.cargando = false;
          });
      },
    }
  }

</script>
