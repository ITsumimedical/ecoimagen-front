<template>
    <v-row dense>
        <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="params.fechaInicial" label="Fecha Inicial" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="params.fechaFinal" label="Fecha Final" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <v-autocomplete v-model="params.entidad_id" label="Entidad" outlined dense :items="entidades"
                item-text="nombre" item-value="id"></v-autocomplete>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            params: {
                fechaInicial: null,
                fechaFinal: null,
                entidad_id: null,
            },
            entidades: [
                {
                    id: 1,
                    nombre: "Entidad 1",
                },
                {
                    id: 2,
                    nombre: "Entidad 2",
                },
                {
                    id: 3,
                    nombre: "Entidad 3",
                },
            ],
        };
    },
    watch: {
        params: {
            handler(newVal) {
                this.$emit("update-params", newVal);
            },
            deep: true,
        },
    },
};
</script>