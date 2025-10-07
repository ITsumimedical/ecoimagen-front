<template>
    <div>
        <v-card v-if="$can('referencia.seguimiento.prestador')">
            <seguimientoReferenciaPrestadorComponent />
        </v-card>
        <v-card v-if="$can('referencia.seguimiento.todo')">
            <seguimientoReferenciaComponent />
        </v-card>
    </div>
</template>
<script>
import seguimientoReferenciaComponent from "~/components/referencia/SeguimientoReferenciaComponent.vue";
import seguimientoReferenciaPrestadorComponent from "~/components/referencia/SeguimientoReferenciaPrestadorComponent.vue"

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('referencia.seguimiento')) {
            return redirect('/');
        }
    },
    name: 'seguimientoReferencia',
    components: {
        seguimientoReferenciaComponent,
        seguimientoReferenciaPrestadorComponent
    },

    data() {
        return {
            componente: null,
        }
    },
    methods: {
    }
}

</script>
