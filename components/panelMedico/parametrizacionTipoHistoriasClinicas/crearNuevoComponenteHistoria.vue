<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Parametrización componentes historia clinica</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <v-data-table :items="componentes" :headers="headers" loading-text="Cargando datos..." :search="buscar"
            no-data-text="Sin registros previos" :loading="loading.listar">
            <template v-slot:top>
                <v-card-title>
                    <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoComponentes()">
                        Crear nuevo componente
                        <v-icon right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
                    </v-text-field>
                </v-card-title>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
                {{ item.created_at?.substring(0,10) }}
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
                <v-icon color="warning" @click="abrirDialogEditar(item)">
                    mdi-pencil
                </v-icon>
            </template>
            <template v-slot:[`item.modelo`]="{ item }">
                <v-chip label :color="item.modelo ? 'primary' : 'grey'" small dark>
                    {{ item.modelo || 'Sin modelo registrado' }}
                </v-chip>
            </template>
            <template v-slot:[`item.ruta_pdf`]="{ item }">
                <v-chip label :color="item.ruta_pdf ? 'success' : 'grey'" dark small>
                    {{ item.ruta_pdf ?? 'Sin ruta para el pdf registrada' }}
                </v-chip>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogComponentesHistoria" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span> {{ modoEdicion ? 'Editar componente' : 'Crear nuevo componente' }}</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>
                <v-form ref="formComponente">
                    <v-card-text>
                        <v-col cols="12">
                            <v-text-field label="Nombre" v-model="componenteHistoria.nombre" dense outlined
                                :rules="[rules.required]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Ruta" v-model="componenteHistoria.ruta" dense outlined
                                :rules="[rules.required]" :disabled="!$can('historia.componente.editar')"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Modelo" v-model="componenteHistoria.modelo" dense outlined
                                :rules="[rules.required]" :disabled="!$can('historia.componente.editar')"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Ruta del pdf" v-model="componenteHistoria.ruta_pdf" dense outlined
                                :rules="[rules.required]" :disabled="!$can('historia.componente.editar')"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-autocomplete label="¿Es escala?" v-model="componenteHistoria.escala" dense outlined
                                :items="escalaItems" :rules="camporRequeridoEscala"></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-autocomplete label="Sexo" :rules="[rules.required]" :items="sexoOpciones" dense outlined
                                v-model="componenteHistoria.sexo"></v-autocomplete>
                        </v-col>
                        <v-col>
                            <v-text-field label="Edad incial" v-model="componenteHistoria.edad_inicial" type="number"
                                dense outlined :rules="[rules.required, rules.noNegativo]"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field label="Edad final" type="number" dense outlined
                                v-model="componenteHistoria.edad_final"
                                :rules="[rules.required, rules.noNegativo, rules.edadFinalMayor(componenteHistoria.edad_inicial)]">
                            </v-text-field>
                        </v-col>
                    </v-card-text>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small dark @click="cerrarDialogo()">Cerrar<v-icon right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn :color="modoEdicion ? 'warning' : 'success'" small
                        @click="modoEdicion ? actualizarComponente(componenteHistoria) : RegistrarNuevoComponente()"
                        :loading="loading.crear">
                        Guardar<v-icon right>mdi-check-bold</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>

</template>

<script>
    export default {
        data() {
            return {
                buscar: '',
                dialogComponentesHistoria: false,
                componentes: [],
                modoEdicion: false,
                sexoOpciones: [
                    'M',
                    'F',
                    'A'
                ],
                escalaItems: [{
                        text: 'Si',
                        value: true
                    },
                    {
                        text: 'No',
                        value: false
                    }
                ],
                rules: {
                    required: v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
                    noNegativo: v => v >= 0 || 'Debe ser un número positivo',
                    edadFinalMayor: edadInicial => v =>
                        parseInt(v) >= parseInt(edadInicial) ||
                        'La edad final debe ser mayor o igual a la edad inicial',
                },
                camporRequeridoEscala: [
                    v => v !== null && v !== undefined || 'Este campo es requerido',
                ],
                componenteHistoria: {
                    nombre: '',
                    ruta: '',
                    modelo: '',
                    ruta_pdf: '',
                    escala: null,
                    sexo: '',
                    edad_inicial: null,
                    edad_final: null
                },
                loading: {
                    crear: false,
                    listar: false
                },
                headers: [{
                        text: 'ID',
                        value: 'id'
                    },
                    {
                        text: 'Nombre',
                        value: 'nombre'
                    },
                    {
                        text: 'Ruta',
                        value: 'ruta'
                    },
                    {
                        text: 'Modelo',
                        value: 'modelo'
                    },
                    {
                        text: 'Ruta pdf',
                        value: 'ruta_pdf'
                    },
                    {
                        text: 'Fecha de registro',
                        value: 'created_at'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    }
                ]
            }
        },

        mounted() {
            this.listarComponentes()
        },

        methods: {
            listarComponentes() {
                this.loading.listar = true
                this.$axios.get('componentes-historia-clinica/listar-componente-historia-clinica').then((res) => {
                    this.componentes = res.data;
                }).catch((error) => {
                    this.$toast.error(error.response.data.error)
                }).finally(() => {
                    this.loading.listar = false
                })
            },

            abrirDialogoComponentes() {
                this.modoEdicion = false
                this.dialogComponentesHistoria = true;
            },

            RegistrarNuevoComponente() {
                if (!this.$refs.formComponente.validate()) return;
                this.loading.crear = true
                this.$axios.post('componentes-historia-clinica/crear-componente-historia-clinica', this
                    .componenteHistoria).then(() => {
                    this.$toast.success('Componente agregado con éxito');
                    this.cerrarDialogo();
                    this.listarComponentes();
                }).catch((error) => {
                    this.$toast.error(error.response.data.error)
                }).finally(() => {
                    this.loading.crear = false
                })
            },

            cerrarDialogo() {
                this.dialogComponentesHistoria = false;
                this.$refs.formComponente.resetValidation();
                this.componenteHistoria = {}
            },

            abrirDialogEditar(item) {
                this.modoEdicion = true;
                this.componenteHistoria = {
                    ...item
                };
                this.dialogComponentesHistoria = true
            },

            actualizarComponente(item) {
                if (!this.$refs.formComponente.validate()) return;
                this.loading.crear = true;
                this.$axios.put('componentes-historia-clinica/actualizar-componente/' + item.id, item).then(() => {
                    this.$toast.success('Componente actualizado con éxito');
                    this.cerrarDialogo();
                    this.listarComponentes();
                }).catch(() => {
                    this.$toast.error('error al actualizar')
                }).finally(() => {
                    this.loading.crear = false
                })
            }
        }
    }

</script>
