<template>
  <div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
	  <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>HISTÓRICO DE SOLICITUDES</b></v-alert>
      <v-col>
        <v-row class="mx-2">
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-text-field dense v-model="radicado_filtro" label="Radicado" outlined></v-text-field>
          </v-col>
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-select dense v-model="estado_filtro" label="Estado" outlined :items="Estados"></v-select>
          </v-col>
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-autocomplete dense v-model="sede_filtro" label="Sedes" outlined :items="sedes"></v-autocomplete>
          </v-col>
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-text-field dense v-model="fechaFiltro" label="Fecha creación" outlined type="date"></v-text-field>
          </v-col>
          <v-col md="2" lg="2" xl="2" sm="2" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn small color="success" @click="listarMisSolicitudes()">Filtrar</v-btn>
              <v-btn small class="ml-2" color="error" @click="limpiarFiltro()">Limpiar</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12" md="12" sm="12">
            <v-text-field label="Buscar" v-model="buscar" hint="Puedes realizar la búsqueda por cualquier campo">
            </v-text-field>
          </v-col>
          <v-col>
            <v-data-table :loading="loading" :disable="loading" :search="buscar" :headers="headers" :items="solicitudes"
              disable-pagination loading-text="Cargando..." hide-default-footer dense
              no-data-text="No hay datos para mostrar">
              <template v-slot:[`item.nombrePrioridad`]="{ item }">
                <v-chip small :color="colorPrioridad(item.nombrePrioridad)" dark>{{ item.nombrePrioridad }}</v-chip>
              </template>
              <template v-slot:[`item.nombreEstado`]="{ item }">
                <v-chip small :color="colorEstado(item.nombreEstado)" dark>{{ item.nombreEstado }}</v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <td>
                  <v-btn @click="solicitudesGeneradas(item)" color="blue" icon small>
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-col>
          <v-dialog v-model="misSolicitudes" persistent width="1000">
            <v-card>
              <v-alert dense text border="left" type="info" icon="mdi-comment-eye-outline">
                Detalle de solicitud
                <v-chip v-if="solicitud.calficacion !== null" color="primary" class="float-right">
                  Calificación de la gestión: {{ solicitud.calficacion }}
                </v-chip>
              </v-alert>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field dense label="Radicado" v-model="solicitud.id" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field dense label="Fecha de creación" v-model="solicitud.fechacreacion" readonly>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field dense label="Usuario" v-model="solicitud.email" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="3">
                    <v-text-field dense label="área" v-model="solicitud.area" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="12">
                    <v-text-field dense label="Asunto" v-model="solicitud.asunto" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea auto-grow dense label="Descripción" v-model="solicitud.descripcion" readonly>
                    </v-textarea>
                  </v-col>
                  <v-col v-if="solicitud.seguimiento_actividades && solicitud.seguimiento_actividades.length > 0">
                    <v-alert dense text border="left" type="success" class="text-center"><b>Respuesta</b></v-alert>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" v-for="(data, index) in solicitud.seguimiento_actividades"
                    :key="index">
                    <v-textarea auto-grow v-model="data.respuesta" readonly :label="`RESPUESTA`"></v-textarea>
                    <span>
                      <strong>Realiza: </strong> {{data.user.operador.nombre_completo }}
                      <strong>Fecha: </strong>{{data.created_at }}
                    </span>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-btn v-for="(data, index) in solicitud.adjuntos_mesa_ayuda" :key="index" color="info"
                      class="ml-2">
                      <v-icon color="white">mdi-cloud-upload</v-icon>
                      <a @click="imprimirAdjunto(data.ruta)" style="color:white">
                        Adjunto {{index+1}}
                      </a>
                    </v-btn>
                  </v-col>
                  <v-col v-if="mostrarBotonResponder">
                    <v-col cols="12" sm="12" md="12">
                      <v-alert class="text-center" text color="info">
                        <b>Responder Comentario</b>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea v-model="respuestaComentario" label="Respuesta" auto-grow dense outlined></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-file-input v-model="adjuntos" small-chips multiple outlined dense label="Adjuntar"
                        accept=".jpg, .jpeg, .png,.doc,.docx,.xml,.xlsx,.pdf">
                      </v-file-input>
                    </v-col>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" small @click="cerrarSolicitud()" dark>Cerrar</v-btn>
                  <v-btn color="warning" small v-if="mostrarBotonResponder" @click="responderComentario()" dark>
                    Responder comentario
                  </v-btn>
                  <v-btn v-if="solicitud.nombreEstado == 'Cerrado'" color="warning" small @click="abrirDialogoReabrir()"
                    dark>Reabrir</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="calificar" persistent width="600">
            <v-card>
              <v-alert color="info" text dense icon="mdi-checkbox-marked-circle-plus-outline">
                Calificar gestión
              </v-alert>
              <v-card-text>
                <v-rating v-model="rating" :length="length" color="red lighten-3" background-color="grey lighten-1"
                  large>
                </v-rating>
                <v-col>
                  <span class="text-caption text-uppercase">Calificación:</span>
                  <span class="font-weight-bold calificacion">
                    {{ rating }}
                  </span>
                </v-col>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" small @click="cerrarDialogos()" dark>Cerrar</v-btn>
                  <v-btn color="info" small dark @click="calificarGestion()">Calificar</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-dialog>


          <v-dialog v-model="dialogReabrir" persistent width="1000">
            <v-card>
              <v-alert dense text border="left" type="warning" icon="mdi-open-in-app">Reabrir caso</v-alert>
              <v-card-text>
                <v-col cols="12" md="12" sm="12">
                  <v-autocomplete v-model="reabrir.categoria" :items="categorias" item-text="nombre" item-value="id"
                    label="Categoria" dense></v-autocomplete>
                </v-col>
                <v-col col="12" md="12" sm="12">
                  <v-textarea v-model="motivoReapertura" outlined label="Motivo" dense auto-grow></v-textarea>
                </v-col>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="limpiarDialogoReabrir">cerrar</v-btn>
                <v-btn color="warning" small @click="reabrirCaso()">Reabrir</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row no-gutters style="background-color: white;">
            <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
              <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                @input="listarMisSolicitudes()"></v-pagination>
            </v-col>
            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
              <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                @change="listarMisSolicitudes()"></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-card>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('mesaAyuda.menu')) {
        return redirect('/');
      }
    },
    name: 'misSolicitudes',
    data() {
      return {
        solicitudes: [],
        pagina: 1,
        total: 0,
        opcionActual: 5,
        adjuntos: [],
        misSolicitudes: false,
        preload: false,
        calificar: false,
        opciones: [5, 10, 20, 50, 100],
        radicado_filtro: '',
        length: 5,
        estado_filtro: '',
        fechaFiltro: '',
        respuestaComentario: '',
        sedes: [
          'SEDE SUMIMEDICAL ITAGÜÍ',
          'SUMIMEDICAL SEDE APOYO TERAPEUTICO',
          'SUMIMEDICAL SEDE PUERTO BERRIO',
          'SUMIMEDICAL RIONEGRO',
          'SUMIMEDICAL QUIBDO',
          'SUMIMEDICAL SEDE BUCARAMANGA',
          'SUMIMEDICAL SEDE TURBO',
          'SUMIMEDICAL COPACABANA',
          'SUMIMEDICAL SEDE CHIGORODÓ',
          'SUMIMEDICAL SEDE ORIENTAL',
          'SUMIMEDICAL SEDE VILLANUEVA',
          'SUMIMEDICAL SEDE ENVIGADO',
          'SUMIMEDICAL SEDE ESTADIO',
          'SUMIMEDICAL SAS BELLO',
          'CLINICA VICTORIANA',
          'SUMIMEDICAL ISTMINA',
          'SUMIMEDICAL SEDE 80',
          'SUMIMEDICAL SEDE AGUACATALA',
          'TRABAJO EN CASA',
          'SUMIMEDICAL SEDE CAUCASIA',
          'SUMIMEDICAL SEDE APARTADO',
        ],
        sede_filtro: '',
        Estados: ['Asignado', 'Reasignada', 'Cerrado'],
        adjuntos_mesa_ayuda: [],
        dialogReabrir: false,
        motivoReapertura: '',
        categorias: [],
        rating: 0,
        loading: false,
        buscar: '',
        reabrir: {
          categoria: ''
        },
        solicitud: {
          id: '',
          email: '',
          area: '',
          prioridad: '',
          asunto: '',
          descripcion: '',
          fechacreacion: '',
          respuesta: '',
          calficacion: '',
        },
        headers: [{
            text: '# Radicado',
            value: 'id',
            align: 'center'
          },
          {
            text: 'Área',
            value: 'area',
            align: 'center'
          },
          {
            text: 'Asunto',
            value: 'asunto'
          },
          {
            text: 'Categoría',
            value: 'nombreCategoria',
            align: 'center'
          },
          {
            text: 'Sede Reportante',
            value: 'sedeNombre',
            align: 'center'
          },
          {
            text: 'Fecha creación',
            value: 'fechacreacion'
          },
          {
            text: 'Estado',
            value: 'nombreEstado',
            align: 'center'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ]
      }
    },
    mounted() {
      this.listarMisSolicitudes()
    },

    computed: {
      mostrarBotonResponder() {
        return (this.solicitud.nombreEstado == 'Reasignada' || this.solicitud.nombreEstado == 'Asignada' || this
            .solicitud.nombreEstado == 'En seguimiento' || this.solicitud.nombreEstado == 'Parcial') &&
          Array.isArray(this.solicitud.seguimiento_actividades) && this.solicitud.seguimiento_actividades.length > 0 &&
          (this.solicitud.seguimiento_actividades[this.solicitud.seguimiento_actividades.length - 1].estado_id == 18 ||
            this.solicitud.seguimiento_actividades[this.solicitud.seguimiento_actividades.length - 1].estado_id == 19);
      }
    },

    methods: {
      listarMisSolicitudes() {
        this.loading = true;
        const params = {
          page: this.pagina,
          cantidad: this.opcionActual,
          radicado_filtro: this.radicado_filtro,
          estado_filtro: this.estado_filtro,
          sede_filtro: this.sede_filtro,
          fechaFiltro: this.fechaFiltro
        };
        this.$axios.get('/mesa-ayuda/listarMisSolicitudes', {
            params
          })
          .then(res => {
            this.solicitudes = res.data.data;
            this.total = res.data.last_page;
            this.loading = false;
            if (this.solicitudes.length === 0) {
              this.NoGeneradas();
            }
          })
          .catch(e => {
            console.error(e);
            this.loading = false;
          });
      },
      solicitudesGeneradas(item) {
        this.misSolicitudes = true;
        this.solicitud = item;
      },
      abrirDialogoReabrir() {
        this.fetchCategorias();
        this.dialogReabrir = true;
      },
      NoGeneradas() {
        this.$swal({
          title: "¡Atencion!",
          text: "No tienes solicitudes generadas",
          type: "warning",
        });
      },
      limpiarFiltro() {
        this.radicado_filtro = '';
        this.estado_filtro = '';
        this.sede_filtro = '';
        this.fechaFiltro = '';
        this.listarMisSolicitudes();
      },
      async imprimirAdjunto(ruta) {
        try {
          this.preload = true;
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
          this.preload = false;
        } catch (error) {
          this.preload = false;
          this.$toast.error('El adjunto de la factura no existe!');
          console.log(error.response);
        }
      },


      calificarGestion() {
        this.preload = true;
        this.$axios.post(`/mesa-ayuda/calificar/${this.solicitud.id}`, {
            calificacion: this.rating
          })
          .then(response => {
            this.$toast.success('Calificación guardada exitosamente.');
            this.cerrarDialogos();
          })
          .catch(error => {
            this.$toast.error('Error al guardar la calificación. Por favor, intenta nuevamente.');
          })
          .finally(() => {
            this.preload = false;
          });
      },
      async cerrarSolicitud() {
        // Verificar si el estado de la solicitud es "Cerrado"
        if (this.solicitud.nombreEstado !== 'Cerrado') {
          // Si el estado no es "Cerrado", cerrar directamente los diálogos
          this.misSolicitudes = false;
          this.limpiarResponderComentario()
          return;
        }

        // Verificar si la calificación es nula
        if (this.solicitud.calficacion === null) {
          // Mostrar swal para preguntar si desea calificar
          const {
            value
          } = await this.$swal({
            title: '¿Desea calificar la gestión?',
            text: 'Seleccione "Calificar" para dar una calificación o "Cancelar" para cerrar la solicitud.',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Calificar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          });

          if (value) {
            // Si el usuario desea calificar, abrir el diálogo de calificación
            this.abrirDialogoCalificacion();
          } else {
            // Si el usuario cancela, cerrar todos los diálogos
            this.misSolicitudes = false;
          }
        } else {
          this.misSolicitudes = false;
        }
      },

      limpiarResponderComentario() {
        this.misSolicitudes = false,
          this.respuestaComentario = ''
        this.adjuntos = []
        this.listarMisSolicitudes()
      },

      abrirDialogoCalificacion() {
        this.calificar = true;
      },

      async reabrirCaso() {
        // Validar que se haya ingresado motivo y categoría
        if (!this.motivoReapertura || !this.reabrir.categoria) {
          await this.$swal({
            title: "¡Error!",
            text: "Debe ingresar tanto la categoria como el motivo.",
            type: "warning",
          });
          return;
        }
        // Mostrar la alerta de confirmación
        const result = await this.$swal({
          title: "Atención!",
          text: "¿Esta seguro de reasignar esta solicitud?.",
          type: "info",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, reasignar',
          cancelButtonText: 'Cancelar'
        });
        if (result.value) {
          this.preload = true;
          const data = {
            categoria_mesa_ayuda_id: this.reabrir.categoria,
            motivo: this.motivoReapertura
          };
          try {
            await this.$axios.post(`mesa-ayuda/reabrirCaso/${this.solicitud.id}`, data);
            this.limpiarDialogoReabrir();
            this.limpiarFiltro();
            this.$toast.success('Caso reaisgnado exitosamente');
            this.listarMisSolicitudes();
          } catch (error) {
            console.error(error);
            this.$toast.error('Error al reasignar el caso.');
          } finally {
            this.preload = false;
          }
        }
      },

      responderComentario() {
        if (!this.respuestaComentario) {
          return this.$swal({
            title: "¡Error!",
            text: "Debe ingresar una respuesta al comentario",
            type: "warning",
          })
        }
        this.preload = true;
        const formData = new FormData();
        formData.append(`motivo`, this.respuestaComentario);
        for (let i = 0; i < this.adjuntos.length; i++) {
          formData.append(`adjuntos[]`, this.adjuntos[i]);
        }
        this.$axios.post(`mesa-ayuda/responderComentario/${this.solicitud.id}`, formData)
          .then(res => {
            this.$toast.success(res.data.mensaje);
            this.limpiarResponderComentario()
            this.preload = false
          })
          .catch(e => {
            this.preload = false
          });
      },



      cerrarDialogos() {
        this.calificar = false,
          this.misSolicitudes = false
        this.rating = 0
      },
      colorPrioridad(Prioridad) {
        switch (Prioridad) {
          case 'Alta':
            return 'red';
          case 'Media':
            return 'orange';
          case 'Baja':
            return 'green';
          default:
            return '';
        }
      },
      fetchCategorias() {
        this.loading = true;
        this.$axios.get('/CategoriaMesaAyuda/listar')
          .then(res => {
            this.loading = false;
            this.categorias = res.data;
          })
          .catch(error => {
            this.toast.error('No se encontraron prioridades');
          });
      },
      limpiarDialogoReabrir() {
        this.dialogReabrir = false;
        this.motivoReapertura = '';
        this.reabrir.categoria = '';
      },
      colorEstado(estado) {
        switch (estado) {
          case 'Anulado':
            return 'red';
          case 'Reasignada':
            return 'orange';
          case 'Cerrado':
            return 'green';
          case 'Asignado':
            return 'blue darken-4';
          default:
            return '';
        }
      },
    }
  }

</script>
