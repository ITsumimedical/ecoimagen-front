<template>
    <v-row dense style="width: 100%">
        <v-col cols="12" sm="4" md="4">
            <v-text-field v-model="params.fechaInicial" label="Fecha Inicial" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
            <v-text-field v-model="params.fechaFinal" label="Fecha Final" outlined dense type="date"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
            <v-autocomplete v-model="params.entidad" label="Entidad" outlined dense :items="entidades"
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
                entidad: null,
            },
            entidades: [
                {
                    id: 1,
                    nombre: "FOMAG",
                },
                {
                    id: 3,
                    nombre:
                        "Fondo de pasivo social de ferrocarriles nacionales de Colombia",
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