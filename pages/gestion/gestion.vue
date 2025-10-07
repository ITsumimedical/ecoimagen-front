<template>
    <div>
        <v-row>
            <v-col cols="12" sm="6" md="3">
                <v-card>
                    <v-card-title class="titulo white--text justify-center">Buscar Afiliado</v-card-title>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field append-icon="mdi-magnify" clearable label="Número documento" type="number"
                                    autofocus>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="9">
                <v-card>
                    <v-card-title class="titulo white--text justify-center">Datos del Afiliado</v-card-title>
                    <AfiliadoComponent :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                        :mostrarClasificaciones="true"></AfiliadoComponent>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="9" offset-md="3">
                <v-card>
                    <v-card-title class="titulo white--text justify-center">Gestión</v-card-title>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete item-text="nombre" item-value="id" label="Gestión"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete item-text="nombre" item-value="id"
                                    label="Ámbito de la atención"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="12">
                                <v-alert dense outlined type="error">
                                    Recuerde que si no indica el "Médico que Ordenó" toda la transcripción sera
                                    cargada a su usuario y
                                    respectivamente cobrada al mismo.
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="6" md="12">
                                <v-autocomplete item-text="nombre" item-value="id"
                                    label="Selecciona la entidad que emite">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field append-icon="mdi-magnify" clearable label="Finalidad" autofocus>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field append-icon="mdi-magnify" clearable label="Diagnóstico" autofocus>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <input type="file" id="file" ref="myFiles" class="custom-file-input" />
                            </v-col>
                            <v-col cols="12" sm="6" md="8">
                                <v-alert dense outlined type="error">
                                    Los archivos deben tener un tamaño máximo de 10MB
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-col>
                        <v-textarea outlined name="input-7-4" label="Observaciones">
                        </v-textarea>
                    </v-col>
                    <v-col>
                        <v-btn color="success">Guardar</v-btn>
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import AfiliadoComponent from "../../components/afiliado/FormularioAfiliadoComponente.vue";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonGestion',
    components: {
        AfiliadoComponent
    },

    data() {
        return {
            datos: [],
        };
    },

    methods: {

    },
};

</script>

<style scoped></style>
