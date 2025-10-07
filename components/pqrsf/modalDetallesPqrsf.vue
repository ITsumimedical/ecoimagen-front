<template>
  <div>
    <v-dialog
      v-model="mostrarDetallesPqrsf"
      max-width="950px"
      persistent
      v-if="pqrsf"
    >
      <v-card>
        <v-alert text dense border="left" type="info" icon="mdi-message-alert">
          <b>Detalles de la PQRSF N° {{ pqrsf.id }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-alert
                dense
                text
                border="left"
                color="warning"
                icon="mdi-message-alert-outline"
              >
                <p v-if="pqrsf.estado.id === 5 || pqrsf.estado.id === 17">
                  Señor Usuario, la respuesta a este caso se envió al correo
                  electrónico registrado, donde podrá verla en su totalidad.
                </p>
                <p v-else-if="pqrsf.estado.id === 10">
                  Señor Usuario, en estos momentos su caso se encuentra
                  pendiente por gestionar. La respuesta será enviada al correo
                  electrónico registrado.
                </p>
                <p v-else>
                  Señor Usuario, actualmente nos encontramos gestionando su
                  caso. La respuesta será enviada al correo electrónico
                  registrado.
                </p>
              </v-alert>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="Fecha de Radicación"
                :value="$moment(pqrsf.created_at).format('dddd, D MMMM YYYY')" readonly
                append-icon="mdi-calendar-range"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="Estado" :value="obtenerEstado(pqrsf.estado_id).nombre" readonly >
                <template v-slot:append>
                  <v-chip dark small  :color="obtenerEstado(pqrsf.estado_id).color" >
                    {{
                    obtenerEstado(pqrsf.estado_id).nombre }}
                  </v-chip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="N° Radicado" :value="pqrsf.id" readonly
                append-icon="mdi-text-box-search-outline"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="N° Documento Afiliado" :value="pqrsf.documento_genera" readonly
                append-icon="mdi-credit-card-search-outline"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="Nombre Afiliado" :value="pqrsf.quien_genera" readonly
                append-icon="mdi-account-circle"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="Correo Electrónico Registrado" :value="pqrsf.correo" readonly
                append-icon="mdi-email"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field outlined dense label="Teléfono o Celular Registrado" :value="pqrsf.telefono" readonly
                append-icon="mdi-phone"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6" v-if="pqrsf.gestion_pqr?.length > 0">
              <v-text-field outlined dense label="Fecha de Solución" :value="$moment(pqrsf.updated_at).format('dddd, D MMMM YYYY')" readonly
                append-icon="mdi-check-decagram"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea  style="text-align: justify;" auto-grow :value="pqrsf.descripcion" label="Descripción del caso" readonly outlined
                dense></v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="pqrsf.gestion_pqr?.length > 0">
              <v-textarea auto-grow :value="pqrsf.gestion_pqr[0]?.motivo" label="Respuesta solución" readonly outlined
                dense></v-textarea>
              <v-chip color="blue-grey" dark class="ma-1" v-for="adjunto in pqrsf.gestion_pqr[0]?.adjuntos"
                :key="adjunto.id" @click="consultarAdjunto(adjunto.ruta)">
                <v-icon left>
                  mdi-paperclip
                </v-icon>
                {{ adjunto.nombre }}
              </v-chip>

            </v-col>

          </v-row>
          <v-form ref="formActualizarDatosPqrsf">
            <v-row dense v-if="pqrsf.estado_id !== 5 && pqrsf.estado_id !== 17">
              <v-col cols="12" sm="12" md="12">
                <v-alert border="left" class="text-center" dense text type="success"
                  icon="mdi-cellphone-marker"><b>Actualizar Información de Contacto</b></v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field dense label="Correo Electrónico" v-model="copiaPqrsf.correo" :rules="[
                    () => !!copiaPqrsf.correo || 'Este campo es requerido',
                    () =>
                      emailRegex.test(copiaPqrsf.correo) ||
                      'Debe ser un correo electrónico válido',
                  ]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field dense label="Teléfono o Celular" v-model="copiaPqrsf.telefono" :rules="[
                    () => !!copiaPqrsf.telefono || 'Este campo es requerido',
                  ]"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="pqrsf.estado_id !== 5 && pqrsf.estado_id !== 17" color="success" small
            @click="actualizarDatosContactoPQRSF">Guardar</v-btn>
          <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    mostrarDetallesPqrsf: Boolean,
    pqrsf: Object,
  },
  data() {
    return {
      copiaPqrsf: null,
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };
  },
  watch: {
    pqrsf: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.copiaPqrsf = JSON.parse(JSON.stringify(newVal));
        }
      },
    },
  },
  methods: {
    ...mapActions('app', ['setPreload']),
    cerrarModal() {
      this.$refs.formActualizarDatosPqrsf.resetValidation();
      this.$emit("update:mostrarDetallesPqrsf", false);
    },
    obtenerEstado(estadoId) {
      switch (estadoId) {
        case 5:
          return { color: "red darken-2", nombre: "Anulado" };
        // En Gestión - Se usa esta modificacion visual ya que no es de interes para el usuario que la PQRSF esté en estado Asignado o PreSolucionado(Parcial)
        case 6:
        case 18:
          return { color: "blue darken-2", nombre: "En Gestión" };
        case 10:
          return { color: "yellow darken-2", nombre: "Pendiente" };
        case 17:
          return { color: "green darken-2", nombre: "Cerrado" };
        default:
          return { color: "gray", nombre: "Desconocido" };
      }
    },

    actualizarDatosContactoPQRSF() {
      if (this.$refs.formActualizarDatosPqrsf.validate()) {
        const data = {
          pqrsf_id: this.pqrsf.id,
          correo: this.copiaPqrsf.correo,
          telefono: this.copiaPqrsf.telefono,
        };

        this.$emit("actualizarDatosContactoPQRSF", data);
        this.cerrarModal();
      } else {
        this.$toast.error("Por favor, complete todos los campos obligatorios");
        return;
      }
    },
    async consultarAdjunto(ruta) {
      this.setPreload(true);
      try {
        let adj = await this.$adjuntos(ruta);
        let blob = new Blob([adj[1]], {
          type: adj[0],
        });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        window.open(link.href, "_blank");
      } catch (error) {
        this.$toast.error("Error al cargar el archivo");
      } finally {
        this.setPreload(false);
      }
    },

    
  },
};
</script>
