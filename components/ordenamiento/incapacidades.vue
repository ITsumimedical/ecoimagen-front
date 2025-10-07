<template>
  <div>
    <v-container fluid>
      <v-row dense v-show="formularioIncapacidad">
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete v-model="incapacidad.contingencia" :items="contingencias" label="Selecciona la contingencia"
            dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field label="Fecha inicio" v-model="incapacidad.fecha_inicio" dense outlined
            :readonly="!$can('fecha_inicio.editar')" type="date">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="incapacidad.dias" type="number" min="0" @input="calcularFechaFinal()"
            oninput="validity.valid||(value='');" label="Cantidad días" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field label="Fecha finalización" readonly v-model="incapacidad.fecha_final" dense outlined>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-select v-model="incapacidad.prorroga" :items="siNo" label="Prórroga" dense outlined></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete :items="colegios" item-text="nombre" item-value="id" label="Labora en:" dense outlined
            :search-input.sync="nombre" v-model="incapacidad.colegio_id"
            no-data-text="Introduce 6 digitos para buscar el colegio">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <!-- <v-autocomplete dense outlined v-model="incapacidad.diagnostico_id" :items="cie10"
            :item-text="concatenarCie10" item-value="id" label="Diagnóstico*">
          </v-autocomplete> -->

          <v-autocomplete v-model="incapacidad.diagnostico_id" :loading="loading" :items="cie10"
            item-text="Codigo_Nombre" label="Diagnóstico" item-value="id" :search-input.sync="buscaCie10" dense outlined solo
            no-data-text="Por favor escriba el nombre del diagnostico"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-textarea v-model="incapacidad.descripcion_incapacidad" auto-grow label="Descripción de la incapacidad"
            dense outlined></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" v-if="mostrarBotonRegistrar" small @click="registrarIncapacidad()">
        Registrar incapacidad
      </v-btn>
    </v-card-actions>
    <v-col cols="12" sm="12" md="12" v-show="formularioIncapacidad == false">
      <v-alert text dense color="teal" icon="mdi-comment-check" border="left">
        <h3 class="text-center">Se ha registrado su incapacidad con el radicado #
          <b>{{incapacidadRegistrada.id}}</b><br><strong>Somos Horus-Health</strong></h3>
      </v-alert>
    </v-col>
    <div class="text-center">
      <v-btn v-if="incapacidadRegistrada.id" tile color="warning" small class="mb-6" @click="imprimirIncapacidad()">
        Imprimir
      </v-btn>
    </div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonIncapacidades',
    props: ['afiliado', 'consulta'],
    data() {
      return {
        formularioIncapacidad: true,
        incapacidadRegistrada: {},
        preload: false,
        colegios: [],
        fecha: this.$moment().format('YYYY-MM-DD'),
        siNo: ['Si', 'No'],
        loading: false,
        mostrarBotonRegistrar: true,
        cie10: [],
        buscaCie10: null,
        loading:false,
        menu: false,
        modal: false,
        nombre: '',
        tienePermiso: false, // Cambia esto según la lógica de permisos
        incapacidad: {
          diagnostico_id: '',
          contingencia: '',
          fecha_inicio: this.$moment(new Date()).format('YYYY-MM-DD'),
          dias: '',
          fecha_final: '',
          colegio_id: '',
          prorroga: 'No',
          descripcion_incapacidad: '',
        },
        contingencias: [
          'Enf. Comun ',
          'licencia maternidad',
          'Accidente de trabajo',
          'Enf. Profesional',
          'Licencia Paternidad',
          'Accidente (Soat)'
        ],

      };
    },

    created() {

      // Si el usuario no tiene permiso, se inicializa la fecha de inicio con la fecha actual
      if (!this.tienePermiso) {
        this.incapacidad.fecha_inicio = this.$moment().format('YYYY-MM-DD');
      }
    },

    watch: {
      nombre: function () {
        if (this.nombre && this.nombre.length == 6) {
          this.buscarColegio();
        }
      },

      buscaCie10(val) {
        if (val) {
          if (val.length === 4) {
            this.listarCie10();
          } else if (val.length < 4) {
            this.cie10 = [];
          }
        } else {
          this.cie10 = [];

        }
      }
    },
    methods: {
      calcularFechaFinal() {
        this.enable = true;

        if (this.incapacidad.dias <= 0) {
          this.$swal({
            title: "Incapacidad",
            text: "Por favor ingrese una cantidad de días mayor a 0",
            timer: 2000,
            icon: "error",
            buttons: false
          });

          this.enable = false;
          this.incapacidad.fecha_final = null;
        }

        if (
          this.incapacidad.contingencia != "licencia maternidad" &&
          this.incapacidad.dias > 30
        ) {
          this.$swal({
            title: "Incapacidad",
            text: "Por favor ingrese una cantidad de días menor o igual a 30 días!",
            timer: 2000,
            icon: "error",
            buttons: false
          });

          this.enable = false;
          this.incapacidad.fecha_final = null;
        }

        if (this.enable == true) {
          this.incapacidad.fecha_final = this.$moment(
            this.incapacidad.fecha_inicio
          ).add(this.incapacidad.dias - 1, "d").format("YYYY-MM-DD");
        }
      },
      // listarCie10() {
      //   this.$axios.get('/cie10/listar').then(res => {
      //     this.cie10 = res.data
      //   }).catch(error => {
      //     console.log(error)
      //   })
      // },


      listarCie10() {
        const data = {
          valor: this.buscaCie10
        }
        this.loading = true
        this.$axios.$post('cie10/listarFiltro', data).then(res => {
          this.cie10 = res
        }).catch(err => {
          console.log(err)
          this.$toast.error(err.response.data.mensaje)
        }).finally(() => {
          this.loading = false
        })
      },


      concatenarCie10(listarCie10) {
        return `${listarCie10.codigo_cie10} - ${listarCie10.nombre}`;
      },
      registrarIncapacidad() {

        if (this.incapacidad.contingencia == '') {
          return this.$toast.error('Debe seleccionar una contingencia.')
        }
        if (this.incapacidad.diagnostico_id == '') {
          return this.$toast.error('Debe seleccionar un diagnostico.')
        }
        if (this.incapacidad.dias == '') {
          return this.$toast.error('La cantidad de días es requerido.')
        }
        if (this.incapacidad.descripcion_incapacidad == '') {
          return this.$toast.error('Descripción de la incapacidad es requerido.')
        }
        this.preload = true;
        this.incapacidad.consulta_id = this.consulta
        this.$axios.post('/incapacidades/registrar', this.incapacidad).then(res => {
          this.incapacidadRegistrada = res.data.res
          this.$toast.success(res.data.mensaje)
          this.formularioIncapacidad = false
          this.mostrarBotonRegistrar = false
          this.limpiarData()
          this.preload = false;
        }).catch(error => {
          console.log('error', error);
        }).finally(() => {
          this.preload = false
        })
      },
      limpiarData() {
        for (const key in this.incapacidad) {
          this.incapacidad[key] = ''
        }
      },
      imprimirIncapacidad() {
        this.preload = true;
        const data = {
          incapacidad_id: this.incapacidadRegistrada.id,
          tipo: 'incapacidad'
        }
        this.$axios.post('pdf', data, {
          responseType: "arraybuffer"
        }).then(res => {
          this.preload = false;
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        }).catch(res => {
          console.log(res)
          this.preload = false;
        });
      },
      buscarColegio() {
        this.preload = true;
        this.$axios.get(`/colegios/buscarColegio/${this.nombre}`)
          .then(res => {
            this.colegios = res.data;
            this.preload = false;
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
            this.preload = false;
          });
      },
    },
  };

</script>

<style lang="scss" scoped>
</style>
