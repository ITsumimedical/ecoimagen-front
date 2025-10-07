<template>
  <v-card>
    <!-- cierra el modal -->
    <v-toolbar dense class="elevation-0" color="titulo">
      <v-btn icon @click="$emit('respuestaComponente')">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- titulo del chat -->
      <span>Chat Horus-Health</span>
    </v-toolbar>

    <template>
      <div class="text-center">
        <v-dialog v-model="preload_chat" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <!-- organizador de tres columnas -->
    <v-row no-gutters>

      <!-- Primera columna si es referencia -->
      <v-col v-if="tipo == 1" cols="12" md="4">
        <v-container fluid>
          <v-card>
            <v-alert text dense border="left" color="blue-grey" icon="mdi-account-eye">
              <b>Información del afiliado</b>
            </v-alert>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <span>
                    <b>Nombre: </b> {{ obtenerNombreCompletoAfiliado }}
                </span>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span>
                    <b>Tipo: </b>{{ formAfiliado ? formAfiliado.tipo_documento.nombre : 'Sin Tipo documento' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <span>
                    <b>Documento: </b>{{ formAfiliado ? formAfiliado.numero_documento : 'Sin documento' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <span>
                    <b>Edad:</b> {{ formAfiliado ? formAfiliado.edad_cumplida : 'Sin Edad' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="8">
                  <span>
                    <b>Entidad: </b>{{ formAfiliado ? formAfiliado.entidad.nombre : 'Sin Entidad' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Tipo Afiliacion:
                    </b>{{ formAfiliado ? formAfiliado.tipo_afiliado.nombre : 'Sin tipo de afiliación' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Estado Afiliación: </b>
                    <br>{{ formAfiliado ? formAfiliado.estado_afiliado.nombre : 'Sin estado' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Municipio de Atención:</b>
                    <br>{{ formAfiliado ? formAfiliado.municipio_afiliacion?.nombre : 'No registra' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Departamento de Atención:</b>
                    <br>{{ formAfiliado ? formAfiliado.departamento_afiliacion.nombre : 'No registra' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Correo Primario:</b>
                    <br>{{ formAfiliado.correo1 ? formAfiliado.correo1 : 'Sin correo secundario' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Correo Segundario:</b>
                    <br>{{ formAfiliado.correo2 ? formAfiliado.correo2 : 'Sin correo secundario' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Telefono Primario:</b>
                    <br>{{ formAfiliado.celular1 ? formAfiliado.celular1 : 'Sin telefono primario' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <span>
                    <b>Telefono Segundario:</b>
                    <br>{{ formAfiliado.celular2 ? formAfiliado.celular2 : 'Sin telefono secundario' }}
                  </span>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <span>
                    <b>Dirección:</b> <br>{{ formAfiliado.direccion ? formAfiliado.direccion : 'Sin dirección' }}
                  </span>
                </v-col>
                <v-col v-for="(clasifiacionesAfiliado) in formAfiliado.clasificacion"
                  :key="formAfiliado.clasificacion.id" class="shrink" cols="12" sm="6" md="6">
                  <v-tooltip bottom color="grey darken-3" dark>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        <v-chip color="red darken-1" outlined small label>
                          <v-icon small left>mdi-alert-circle</v-icon>
                          <b>{{ clasifiacionesAfiliado ? clasifiacionesAfiliado.nombre : 'Sin Clasificacion' }}</b>
                        </v-chip>
                      </span>
                    </template>
                    <span>{{ clasifiacionesAfiliado ? clasifiacionesAfiliado.descripcion : 'Sin Clasificacion' }}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <span>
                    <b>Adjuntos:</b>
                  </span>
                </v-col>
                <v-row>
                  <v-container>
                    <v-col cols="12" sm="3" md="2" v-for="(adjuntoR, index) in datosReferencia.adjunto_referencia"
                      :key="index">
                      <v-btn small>
                        <a @click="consultarAdjunto(adjuntoR.ruta)">
                          {{ adjuntoR.nombre }}
                        </a>
                        <v-icon small color="info">mdi-file-find</v-icon>
                      </v-btn>
                    </v-col>
                  </v-container>
                </v-row>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
      <!-- Primera columna -->
      <v-col v-if="tipo != 1" cols="12" md="3">
        <v-subheader v-text="header"></v-subheader>
        <v-toolbar class="elevation-0" dense>

          <!-- busqueda de usuarios -->
          <v-autocomplete dense :items="empleados" item-text="nombre_completo" item-value="user_id" v-model="usuario_id"
            :loading="loading" :search-input.sync="search" class="mx-4" flat hide-no-data hide-details
            label="Buscar por nombre" solo-inverted></v-autocomplete>

          <!-- boton para iniciar chat -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" @click="crearCanal(usuario_id)" v-bind="attrs" v-on="on">mdi-comment-processing
              </v-icon>
            </template>
            <span>Nuevo Chat</span>
          </v-tooltip>
        </v-toolbar>

        <div style="height: 81vh; overflow: auto">
          <v-list dense>
            <!-- lista de chat -->
            <v-list-item-group color="primary">
              <v-list-item v-for="item in chats" :key="item.id" @click="abrirMensajes(item)">
                <!-- imagen del chat -->
                <v-list-item-avatar>
                  <v-img :src="avatar"></v-img>
                </v-list-item-avatar>

                <!-- contenido nombre y cargo -->
                <v-list-item-content>
                  <v-list-item-title v-text="concatenarNombre(item)"></v-list-item-title>
                  <v-list-item-subtitle v-text="cargo(item)"></v-list-item-subtitle>
                </v-list-item-content>

                <!-- icono de chat -->
                <v-list-item-icon>
                  <v-icon :color="'deep-purple accent-4'">
                    mdi-message-outline
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-col>
      <!-- <pre>{{mensajesChat}}</pre> -->
      <!-- segunda columna -->
      <v-col cols="12" :md="tipo != 1 ? 5 : 4">
        <MensajeComponent :datos="mensajesChat" :referenciaChat="datosReferencia" :mensajes="this.mensajesChat.mensajes" />
      </v-col>

      <!-- tercera columna -->
      <v-col v-if="tipo != 1" cols="12" md="4">
        <v-component :is="componente" :datos="informacionPersonal"></v-component>
      </v-col>

      <!-- tercera columna si es referencia -->
      <v-col v-if="tipo == 1" cols="12" md="4">
        <InformacionReferenciaComponent :referencia="datosReferencia" @respuestaComponente="cerrarReferencia()">
        </InformacionReferenciaComponent>
      </v-col>
    </v-row>

  </v-card>
</template>

<script>
import informacionEmpleadoComponent from "../chat/informacionEmpleado.vue";
import MensajeComponent from "../chat/MensajesComponent.vue";
import InformacionReferenciaComponent from "~/components/chat/InformacionReferenciaComponent.vue";
import AfiliadoComponent from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import Pusher from "pusher-js";

export default {
  middleware({
    $can,
    redirect
  }) {
    if (!$can("blog.vista")) {
      return redirect("/");
    }
  },

  name: 'chatComponent',
  props: {
    tipo: null,
    datosReferencia: Object,
    formAfiliado: null,
  },

  components: {
    AfiliadoComponent,
    informacionEmpleadoComponent,
    MensajeComponent,
    InformacionReferenciaComponent
  },

  data: () => ({
    dialog: false,
    mensajes: null,
    informacionPersonal: null,
    preload_chat: false,
    search: null,
    mensaje: null,
    usuario_id: null,
    componente: null,
    adjuntos: [],
    empleados: [],
    mensajesChat: [],
    loading: false,
    avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    header: "Chats",
    chats: [],
  }),

  computed: {
        obtenerNombreCompletoAfiliado() {
            const a = this.formAfiliado || {};
            return [
            a.primer_nombre,
            a.segundo_nombre,
            a.primer_apellido,
            a.segundo_apellido
            ]
            .filter(Boolean)
            .join(' ') || 'Sin Nombre';
        }
    },

  mounted() {

    Pusher.logToConsole = false;
    const pusher = new Pusher('496314bdeba55d9c3763', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe(`sendMenssage${this.datosReferencia.canal.id}`);
    channel.bind('message', data => {
      console.log(data)
      this.mensajesChat.mensajes.push(data.mensaje)
    });

    if (this.datosReferencia) {
      this.mensajesChat = this.datosReferencia.canal
    } else {
      this.listarEmpleados();
      this.listarChats();
    }
  },

  methods: {
    concatenarNombre(item) {
      if (item.user_crea_id == this.$store.state.auth.usuario.id) {
        if (item.sn_user_recibe == null) {
          return `${item.pn_user_recibe} ${item.pa_user_recibe} ${item.sa_user_recibe}`;
        } else {
          return `${item.pn_user_recibe} ${item.sn_user_recibe} ${item.pa_user_recibe} ${item.sa_user_recibe}`;
        }
      } else {
        if (item.sn_user_envia == null) {
          return `${item.pn_user_envia} ${item.pa_user_envia} ${item.sa_user_envia}`;
        } else {
          return `${item.pn_user_envia} ${item.sn_user_envia} ${item.pa_user_envia} ${item.sa_user_envia}`;
        }
      }
    },

    cargo(item) {
      if (item.user_crea_id == this.$store.state.auth.usuario.id) {
        return item.cargo_user_recibe
      } else {
        return item.cargo_user_envia
      }
    },

    eliminarChip(index) {
      this.adjuntos.splice(index, 1);
    },

    /*
    ! litar Usuarios
    * @return object usuarios
    * @author Kobatime
    */

    listarEmpleados() {
      this.loading = true
      this.$axios.get("/empleados/listarEmpleadosActivos").then(res => {
        this.empleados = res.data
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },

    /*
    ! crear canales
    * @author Kobatime
    */
    crearCanal(user_id) {
      const requets = {
        user_recibe_id: user_id,
      };
      this.$axios
        .post("/chat/crear", requets)
        .then((res) => {
          this.user_id = null;
          this.listarChats();
        })
        .catch((e) => {
          this.$toast.error(e.response.data.error);
        });
    },

    listarChats() {
      this.$axios
        .get("/chat/listar/" + this.$store.state.auth.usuario.id)
        .then((res) => {
          this.chats = res.data.data;
        })
        .catch((e) => {
          this.$toast.error(e.response.data.error);
        });
    },

    abrirMensajes(item) {
      this.mensajes = item;
      this.componente = "informacionEmpleadoComponent";
      this.informacionPersonal = item;
      this.mensajesChat = item;
    },

    async consultarAdjunto(ruta) {
      try {
        this.preload_chat = true;
        let adj = await this.$adjuntos(ruta);
        let blob = new Blob([adj[1]], {
          type: adj[0],
        });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        window.open(link.href, "_blank");
        this.preload_chat = false;
      } catch (error) {
        this.preload_chat = false;
        console.log(error.Response);
      }
    },

    cerrarReferencia() {
      this.$emit('respuestaComponente')
    }
  },
};

</script>
