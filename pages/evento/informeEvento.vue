<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Panel de descarga reporte eventos adversos</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title> <v-form>
                <v-col cols="12" sm="12" md="12">
                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field outlined dense v-model="descarga.f_init" label="Fecha desde" type="date">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field outlined dense v-model="descarga.f_fin" label="Fecha hasta" type="date">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-autocomplete outlined clearable dense v-model="descarga.evento" :items="sucesos"
                                label="Área" item-text="nombre" item-value="nombre"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="boton" dark @click="reporte()">
                            Generar informe
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-form>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonInformeEvento',

    middleware({
        $can,
        redirect
    }) {
        if (!$can('eventoAdverso.informe')) {
            return redirect('/');
        }
    },

    data() {
        return {
            sucesos: [],
            descarga: {
                f_init: '',
                f_fin: '',
                evento: '',
            },
        };
    },

    mounted() {
        this.listarSucesos()
    },

    methods: {
        listarSucesos() {
            this.$axios.get('/sucesos/listar').then(res => {
                this.sucesos = res.data.data;
            })
        },

        reporte() {
            if (this.descarga.f_init == '') {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debes determinar una fecha desde y una fecha hasta",
                    type: "warning",
                });
            }
            if (this.descarga.f_fin == '') {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debes determinar una fecha desde y una fecha hasta",
                    type: "warning",
                });
            }
            this.$axios({
                method: 'post',
                params: {
                    f_init: this.descarga.f_init,
                    f_fin: this.descarga.f_fin,
                    evento: this.descarga.evento
                },
                url: '/eventos-adversos/reporte',
                responseType: 'blob',
            }).then(res => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.download = 'eventosAdversos.xlsx';
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.clear();
            }).catch(err => {
                console.log(err)
            })
        }
    },
};

</script>

<style lang="scss" scoped></style>
