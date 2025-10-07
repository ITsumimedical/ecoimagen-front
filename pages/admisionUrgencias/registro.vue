<template>
  <div>
    <v-card elevation="0">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px">
              <span>REGISTRO</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="4" md="4" sm="4">
            <v-row dense>
              <v-col cols="12" md="12" sm="12">
                <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                  <b>Validación de derechos</b></v-alert>
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
                  no-data-text="No hay resultados" item-value="id" item-text="nombre" @change="componente()"
                  v-model="datosBuscarAfiliado.tipo_documento" />
              </v-col>
              <v-col cols="6" md="6" sm="6">
                <v-text-field dense outlined label="Número Documento"
                  v-model.trim="datosBuscarAfiliado.numero_documento" />
              </v-col>
              <v-col cols="6" md="6" sm="6">
              </v-col>
              <v-col cols="6" md="6" sm="6" style="display: flex; gap: 0.2rem">
                <v-btn color="primary" dark @click="consultarAfiliado()" small>Consultar
                </v-btn>
                <v-btn color="red" small dark @click="limpiarAfiliado();">Limpiar
                </v-btn>
              </v-col>
              <v-col cols="12" sm="12" md="12" v-if="afiliado && afiliado.caracterizacion_afiliado">
                <v-alert text dense border="left" color="green darken-1" icon="mdi-close-circle-multiple">
                  <b>Marcaciones</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="12" md="12" v-if="afiliado && afiliado.caracterizacion_afiliado">
                <v-radio-group v-model="afiliado.caracterizacion_afiliado.tipo_violencia_id" dense row>
                  <v-radio v-for="item in opcionesTipoViolencia" :key="item.id" :label="item.nombre" :value="item.id">
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Nombre" readonly v-model.trim="afiliado.primer_nombre" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Segundo nombre" readonly v-model.trim="afiliado.segundo_nombre" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Apellido" readonly v-model.trim="afiliado.primer_apellido" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Segundo Apellido" readonly
                  v-model.trim="afiliado.segundo_apellido" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Sexo" readonly v-model.trim="afiliado.sexo" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Telefono" v-model.trim="afiliado.telefono" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Celular" v-model.trim="afiliado.celular1" />
              </v-col>
              <v-col cols="3" md="3" sm="3" v-if="afiliado">
                <v-text-field dense outlined label="Celular 2" v-model.trim="afiliado.celular2" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Dirección" v-model.trim="afiliado.direccion_residencia_cargue" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Barrio" v-model.trim="afiliado.direccion_residencia_barrio" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Departamento"
                  v-model.trim="afiliado.departamento_atencion.nombre" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Municipio" v-model.trim="afiliado.municipio_atencion.nombre" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Correo1" v-model.trim="afiliado.correo1" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Correo2" v-model.trim="afiliado.correo2" />
              </v-col>
              <v-col cols="12" md="12" sm="12" v-if="afiliado">
                <v-text-field dense outlined label="Contrato/Entidad" readonly v-model.trim="afiliado.entidad.nombre" />
              </v-col>
              <v-col cols="12" md="12" sm="12" v-if="afiliado">
                <v-text-field dense outlined label="Nombre del responsable" readonly
                  v-model.trim="afiliado.nombre_responsable" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Telefono del responsable" readonly
                  v-model.trim="afiliado.telefono_responsable" />
              </v-col>
              <v-col cols="6" md="6" sm="6" v-if="afiliado">
                <v-text-field dense outlined label="Parentesco del responsable" readonly
                  v-model.trim="afiliado.parentesco_responsable" />
              </v-col>
              <v-col cols="12" md="12" sm="12" v-if="afiliado">
                <v-checkbox v-model="checkbox" label="Tratamiento de datos"></v-checkbox>
              </v-col>
              <v-col cols="12" md="12" sm="12" v-if="afiliado">
                <v-btn color="success" small dark @click="actualizarAfiliado()">Actualizar datos del afiliado
                </v-btn>
              </v-col>
            </v-row>

          </v-col>
          <v-col cols="8" md="8" sm="8" v-if="activarComponente">
            <crearAfiliado :nn="nn" :datos="datosBuscarAfiliado" :ejecutar="true" @limpiar="limpiarAfiliado()"
              @triage="activarComponente=false, activarComponenteTriage=true" />
          </v-col>

          <v-col cols="8" md="8" sm="8" v-if="activarComponenteTriage">
            <registroTriage :ejecutar="true" :infoAfiliado="afiliado" />
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
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
  import crearAfiliado from '~/pages/admisionUrgencias/CrearAfiliadoAdmisiones.vue';
  import registroTriage from '~/pages/admisionUrgencias/registroTriage.vue';
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('panelmedico.atenciones')) {
        return redirect('/');
      }
    },
    components: {
      crearAfiliado,
      registroTriage
    },
    name: 'fichero',
    data: () => ({
      preload: false,
      datosBuscarAfiliado: {},
      tiposDocumentos: [],
      activarComponente: false,
      activarComponenteTriage: false,
      nn: false,
      afiliado: null,
      checkbox: false,
      opcionesTipoViolencia: [],
    }),

    watch: {

    },

    mounted() {
      this.listarTiposDocumentos();
      this.listarTipoViolencia();
    },
    methods: {
      listarTiposDocumentos() {

        this.$axios.get("/tipo-documento/listar")
          .then((res) => {
            this.tiposDocumentos = res.data;
          })
          .catch((error) => {
            this.$toast.error(
              "Ocurrió un error al cargar los tipos de documento"
            );
            console.log(error);
          })
          .finally(() => {
            // this.loading = false;
          });
      },

      componente() {

        if(this.datosBuscarAfiliado.tipo_documento == 15){
            this.activarComponente = true
            this.nn = true
        }else{
            this.activarComponente = false
            this.nn = false
        }
      },

      consultarAfiliado() {
        if (this.datosBuscarAfiliado.numero_documento === "" || this.datosBuscarAfiliado.tipo_documento === "") {
          return this.$toast.error(
            "Por favor ingrese el tipo de documento y el número de documento."
          );
        }

        this.preload = true;
        this.$axios.get(
            `/afiliados/buscarAfiliadoCaracterizacion/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
          )
          .then((res) => {
            if (res.data.id) {
              this.afiliado = res.data;
              this.activarComponenteTriage = true
            } else {
              // this.afiliado=null
              // this.activarComponente = true
              // this.nn=false
              this.$swal.fire({
                title: "El afiliado no existe",
                text: "Desea crearlo?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: 'red'
              }).then(res => {
                if (res.value) {
                  this.afiliado = null
                  this.activarComponente = true
                  this.nn = false
                }
              });
            }

          })
          .catch((error) => {
            this.$toast.error(
              "El afiliado no se encuentra registrado en la base de datos."
            );
            console.log(error);
          })
          .finally(() => {
            this.preload = false;
          });
      },

      limpiarAfiliado() {
        this.datosBuscarAfiliado.numero_documento = ''
        this.datosBuscarAfiliado.tipo_documento = ''
        this.afiliado = null
        this.activarComponente = false
        this.nn = false
        this.activarComponenteTriage = false
      },


      actualizarAfiliado() {

        const data = {
          telefono: this.afiliado.telefono,
          celular1: this.afiliado.celular1,
          celular2: this.afiliado.celular2,
          direccion_residencia_cargue: this.afiliado.direccion_residencia_cargue,
          direccion_residencia_barrio: this.afiliado.direccion_residencia_barrio,
          correo1: this.afiliado.correo1,
          correo2: this.afiliado.correo2,
          nombre_responsable: this.afiliado.nombre_responsable,
          telefono_responsable: this.afiliado.telefono_responsable,
          parentesco_responsable: this.afiliado.parentesco_responsable,
        }
        this.$axios.put(`/afiliados/actualizarAdmision/${this.afiliado.id}`, data).then((res) => {
            this.$toast.success(
              "Datos actualizados con exito."
            );
          }).catch((error) => {
            this.$toast.error(
              "El afiliado no se pudo actualizar los datos."
            );
            console.log(error);
          })
          .finally(() => {
            this.preload = false;
          });
      },

      listarTipoViolencia() {
        this.preload = true;
        this.$axios
          .get("tipo-violencia/listarTodas")
          .then((res) => {
            this.opcionesTipoViolencia = res.data;
          })
          .catch((e) => {
            this.$toast.error(
              "Ocurrió un error al cargar los tipos de violencia"
            );
            console.log(e);
          })
          .finally(() => {
            this.preload = false;
          });
      },
    },
  };

</script>
