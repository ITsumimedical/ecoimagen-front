<template>
    <v-card class="ma-3 pa-3  elevation-4" max-width="450">
        <v-card-title class="d-flex align-center">
            <v-icon color="teal" size="32" class="mr-2">{{ notificacion.icon }}</v-icon>
            <span class="font-weight-bold text-h6">{{ notificacion.title }}</span>
        </v-card-title>
        <v-card-text class="mt-2">

            <p class="text-body-1 mb-2">{{ notificacion.mensaje }}</p>
            <v-divider></v-divider>

        </v-card-text>

        <v-card-actions>
            <div class="d-flex justify-end mt-2" style="gap: 8px;">
                <v-chip size="small" color="teal" text-color="white" class="text-caption" label>
                    <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                    <span>{{ $moment(notificacion.time).format('YYYY-MM-DD') }}</span>
                </v-chip>

                <v-chip size="small" color="warning" text-color="white" class="text-caption" label
                    v-if="notificacion?.ruta === '/panelMedico/atencion'" @click="redireccionar(notificacion?.ruta)">
                    <v-icon size="14" class="mr-1">mdi-inbox-arrow-down-outline</v-icon>
                    <span>Ir a panel medico</span>
                </v-chip>
            </div>

            <v-spacer></v-spacer>
            <v-btn icon color="error" @click="cerrarModal()"><v-icon>mdi-close</v-icon></v-btn>

        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        notificacion: {
            type: Object,
            required: true
        }
    },

    methods: {
        cerrarModal() {
            this.$emit('cerrarModal');
        },

        redireccionar(ruta) {
            this.$router.push(ruta);
            this.cerrarModal();
        }
    }
}
</script>
