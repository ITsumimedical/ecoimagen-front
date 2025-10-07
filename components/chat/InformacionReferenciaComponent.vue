<template>
  <v-container fluid>
    <v-card>
      <v-alert text dense border="left" color="blue-grey" icon="mdi-hospital-building">
        <b>Información del prestador</b>
      </v-alert>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Prestador:</b> <br>{{ referencia ? referencia.rep_nombre : 'Sin prestador' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Dirección:</b> <br>{{ referencia ? referencia.rep_direccion : 'Sin dirección' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Municipio:</b> <br>{{ referencia ? referencia.municipio_nombre : 'Sin municipio' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Departamento:</b> <br>{{ referencia ? referencia.departamento_nombre : 'Sin departamento' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Telefono Principal:</b> <br>{{
              referencia ? referencia.rep_telefono1 ? referencia.rep_telefono1 : 'Sin telefono principal' : 'Sin telefono principal'
            }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Telefono Secundario:</b> <br>{{
              referencia ? referencia.rep_telefono2 ? referencia.rep_telefono2 : 'Sin telefono secundario' : 'Sin telefono secundario'
            }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="5">
            <span>
              <b>Correo Principal:</b> <br>{{
              referencia ? referencia.rep_correo1 ? referencia.rep_correo1 : 'Sin correo principal' : 'Sin correo principal'
            }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <span>
              <b>Correo Secundario:</b> <br>{{
              referencia ? referencia.rep_correo2 ? referencia.rep_correo2 : 'Sin correo secundario' : 'Sin correo secundario'
            }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br>
    <v-card>
      <v-alert text dense border="left" color="blue-grey" icon="mdi-information-variant-circle">
        <b>Información de la referencia</b>
      </v-alert>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <!-- <span>
              <b>Tipo Anexo:</b> {{ referencia ? 'Anexo ' + referencia.tipo_anexo : ' Sin Tipo de anexo' }}
            </span> -->
            <v-autocomplete v-model="referencia.tipo_anexo" label="Tipo Anexo" :items="tipoAnexos">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <span>
              <b>Especialidad: </b> {{ referencia ? referencia.especialidad_remision : 'Sin Especilidad' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="12">
            <span>
              <b>Diagnosticos:</b>
            </span>
            <span v-for="dx in referencia.cie10s" :key="dx.Codigo_Nombre">
              <br> * {{ dx ? dx.Codigo_Nombre : 'Sin Diagnostico' }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Codigo Remision" v-model="referencia.codigo_remision" :error-messages="errors.codigo_remision">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-autocomplete v-model="referencia.tipo_solicitud" :items="tipoSolicitud" label="Tipo Solicitud" :error-messages="errors.tipo_solicitud">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="12">
            <span>
              <b>Descripción</b> <br>{{ referencia ? referencia.descripcion : 'Sin Descripción' }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="boton" v-if="$can('referencia.seguimiento.todo') && referencia.estado !='En seguimiento'" small
          dark @click="actualizarReferencia()">
          Gestionar
        </v-btn>
        <v-btn v-if="$can('referencia.seguimiento.todo') && referencia.estado =='En seguimiento'" color="error" small
          dark @click="FinalizarReferencia()">Finalizar
        </v-btn>
<!--        <v-btn v-if="referencia.tipo_anexo =='2'" color="warning" small dark @click="pdf('anexo4')">Imprimir Anexo 4-->
<!--        </v-btn>-->
        <!-- <v-btn v-if="referencia.tipo_anexo =='3'" color="warning" small dark @click="pdf()">Imprimir Anexo 3
        </v-btn>
        <v-btn v-if="referencia.tipo_anexo =='9'" color="warning" small dark @click="pdf('anexo9Referencia')">Imprimir Anexo 9
        </v-btn>
        <v-btn v-if="referencia.tipo_anexo =='10'" color="warning" small dark @click="pdf('anexo10')">Imprimir Anexo 10
        </v-btn> -->
        <v-btn v-if="$can('referencia.seguimiento.todo')" color="info" small dark @click="crearConsulta(referencia)">
          Ordenar</v-btn>
      </v-card-actions>
    </v-card>
    <template>
      <v-col cols="12" sm="12" md="12">
        <Ordenamiento :consulta="consulta_id" :habilitarBoton="false" @respuestaComponente="modalOrdenamiento = false"
          :dialog="modalOrdenamiento" />
      </v-col>
    </template>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can("blog.vista")) {
        return redirect("/");
      }
    },
    name: "informacion-referencia",

    props: {
      referencia: null,
    },


    data() {
      return {
        modalConsulta: false,
        modalOrdenamiento: false,
        consulta_id: null,
        consulta: null,
        tipoAnexos: [
          { 'id': 2, 'text': 'Informe de la atención de urgencias' },
          { 'id': 3, 'text': 'Solicitud de autorización de servicios y tecnologías en salud' },
          { 'id': 9, 'text': 'Referencia' },
          { 'id': 10, 'text': 'Contrareferencia' }
        ],
        tipoSolicitud: [
          'Ambulancia',
          'Aval servicios intrahospitalarios',
          'Ayuda diagnostica externa',
          'Contraremision',
          'Codigo atencion urgencias',
          'Codigo hospitalizacion',
          'Interconsulta red externa',
          'Medicina domiciliaria',
          'Remision Mayor complejidad',
          'Remision Menor complejidad',
          'Oxigeno Domiciliario',
          'Solicitud Ambulatoria'
        ],
        preload: false,
        errors: {
          codigo_remision: '',
          tipo_solicitud: ''
        }
      };
    },

    mounted() {},

    methods: {
      actualizarReferencia() {
        this.preload = true;
        this.$axios.put("/referencias/actualizar/" + this.referencia.id, this.referencia)
          .then((res) => {
            this.$toast.success("Referencia actualizado con éxito !");
            this.limpiarError();
            this.preload = false;
          })
          .catch((error) => {
            this.preload = false;
            if (!this.referencia.codigo_remision || !this.referencia.tipo_solicitud) {
              this.errors.codigo_remision = !this.errors.codigo_remision ?
                '¡Campo de codigo remision requerido!' : null;
              this.errors.tipo_solicitud = !this.errors.tipo_solicitud ?
                '¡Campo de tipo solicitud requerido!' : null;
              return;
            }
          });
      },

      FinalizarReferencia() {
        this.preload = true;
        this.$axios.put("/referencias/finalizar/" + this.referencia.id, this.referencia)
          .then((res) => {
            this.$toast.success("Referencia finalizada con éxito !");
            this.$emit('respuestaComponente')
            this.preload = false;
          })
          .catch((error) => {
            this.preload = false;
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje);
            } else if (error.response.data) {
              this.Error(error.response.data);
            }
          });
      },

      crearConsulta() {
        this.modalOrdenamiento = true
        this.preload = true;
        this.$axios.post("/referencias/CrearConsulta", this.referencia)
          .then((res) => {
            this.preload = false;
            this.consulta_id = res.data.id
          })
          .catch((error) => {
            this.preload = false;
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje);
            } else if (error.response.data) {
              this.Error(error.response.data);
            }
          });
      },

      pdf(item) {
        const data = {
          tipo: item,
          id: this.referencia,
        }
        this.preload = true;
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
        }).catch(error => {
          this.preload = false;
        });
      }
    },
  };

</script>
