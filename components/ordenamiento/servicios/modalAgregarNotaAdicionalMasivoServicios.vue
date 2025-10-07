<template>
  <v-dialog v-model="mostrarModalAgregarNota" persistent max-width="600px" scrollable>
    <v-card>
      <v-alert dense text border="left" color="primary" icon="mdi-note-plus-outline"
               class="text-center">
        <b>Agregar Nota Adicional</b>
      </v-alert>
      <v-card-text>
        <v-form ref="formAgregarNotaAdicional" class="mt-2">
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-textarea dense outlined auto-grow label="Nota Adicional *" v-model="formNota.observacion"
                          :rules="[rules.obligatorio,rules.minCaracteres,rules.maxCaracteres]" counter />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn dark small color="error" @click="cerrarModal">Salir</v-btn>
        <v-btn dark small color="success" @click="enviarFormulario">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
  props: {
    mostrarModalAgregarNota: {
      type: Boolean,
      default: false
    },
    ordenProcedimientos: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      formNota: {
        observacion: ''
      },
      rules: {
        obligatorio: v => !!v || 'Este campo es obligatorio.',
        minCaracteres: v => !!v && v.length >= 10 || 'Este campo debe tener al menos 10 caracteres.',
        maxCaracteres: v => !!v && v.length <= 250 || 'Este campo debe tener como máximo 250 caracteres.'
      }
    }
  },
  methods: {
    ...mapActions('app', ['setPreload']),

    cerrarModal() {
      this.limpiarFormulario();
      this.$emit('update:mostrarModalAgregarNota', false);
    },

    limpiarFormulario() {
      this.formNota = {
        observacion: ''
      };

      this.$refs.formAgregarNotaAdicional.resetValidation();
    },

    async enviarFormulario() {
      if (!this.$refs.formAgregarNotaAdicional.validate()) return;
      const data = {
        orden_procedimientos: this.ordenProcedimientos.map(item => item.id),
        observacion: this.formNota.observacion
      };
      try {
        this.setPreload(true);

        await this.$axios.post('/ordenamiento/agregar-nota-adicional-orden-servicios', data);

        this.$toast.success('Nota guardada con éxito.');

        this.cerrarModal();
      } catch (error) {
        this.$toast.error('Ocurrió un error al guardar la nota.');
      } finally {
        this.setPreload(false);
      }
    }
  }
}
</script>
