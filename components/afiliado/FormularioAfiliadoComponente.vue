<template>
    <div>
        <v-container fluid>
            <v-row v-if="modoDetalle">
                <v-col cols="12">
                    <v-card class="pa-4 rounded-xl elevation-1">
                        <v-row>
                            <v-col cols="12" md="8" class="d-flex flex-wrap align-center" style="gap: 8px;">
                                <!-- IPS Primaria -->
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on" label class="elevation-1 text-no-wrap"
                                            style="background-color: #eceff1; color: #37474f;">
                                            <v-icon left style="color: #607d8b;">
                                                mdi-hospital-building
                                            </v-icon>
                                            <b>IPS Primaria:</b>&nbsp;{{ form.ips?.nombre }} -
                                            {{ form.departamento_atencion?.nombre }} -
                                            {{ form.municipio_atencion?.nombre }}
                                        </v-chip>
                                    </template>
                                    <span>
                                        {{ form.ips?.nombre }} -
                                        {{ form.departamento_atencion?.nombre }} -
                                        {{ form.municipio_atencion?.nombre }}
                                    </span>
                                </v-tooltip>

                                <!-- Estado de afiliación -->
                                <v-tooltip bottom v-if="form?.estado_afiliacion_id">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on" :color="estadoAfiliacionColor"
                                            :text-color="estadoAfiliacionTextColor" label class="elevation-1">
                                            <v-icon left :style="{ color: estadoAfiliacionTextColor }">
                                                {{ estadoAfiliacionIcon }}
                                            </v-icon>
                                            <b>Estado Afiliación:</b>&nbsp;{{ estadoAfiliacionNombre }}
                                        </v-chip>
                                    </template>
                                    <span>Estado de la afiliación</span>
                                </v-tooltip>

                                <!-- Ciclo de vida -->
                                <v-tooltip bottom v-if="form?.ciclo_vida_atencion">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on" :color="colorCicloVida" text-color="white"
                                            label class="elevation-1">
                                            <v-icon left>{{ iconoCicloVida }}</v-icon>
                                            <b>Ciclo:</b>&nbsp;{{ form.ciclo_vida_atencion }}
                                        </v-chip>
                                    </template>
                                    <span>Etapa de ciclo de vida en atención</span>
                                </v-tooltip>

                                <!-- Edad -->
                                <v-tooltip bottom v-if="form?.edad_cumplida !== null">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on" label class="elevation-1"
                                            style="background-color: #eceff1; color: #37474f;">
                                            <v-icon left style="color: #607d8b;">
                                                mdi-calendar-account
                                            </v-icon>
                                            <b>Edad:</b>&nbsp;{{ form.edad_cumplida }}
                                        </v-chip>
                                    </template>
                                    <span>Edad cumplida del afiliado</span>
                                </v-tooltip>

                                <!-- exento -->
                                <v-tooltip bottom v-if="form?.exento_pago !== null">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-chip v-bind="attrs" v-on="on"
                                            style="background-color: #eceff1; color: #37474f;" label
                                            class="elevation-1">
                                            <v-icon left style="color: #607d8b;">
                                                mdi-account-alert
                                            </v-icon>
                                            <b>Excento</b>&nbsp;{{ form.exento_pago }}
                                        </v-chip>
                                    </template>
                                    <span>Exento de Pago</span>
                                </v-tooltip>
                            </v-col>

                            <!-- Sección de acciones -->
                            <v-col cols="12" md="4" class="d-flex justify-end flex-wrap" style="gap: 8px;">

                                <!-- Botón marcación -->
                                <v-btn v-if="$can('gestionarMarcaciones.marcaciones')" dark small color="warning"
                                    @click="mostrarMarcacion = true" class="mr-2">
                                    gestionar marcaciones
                                    <v-icon right>mdi-tag</v-icon>
                                </v-btn>


                                <!-- Diálogo Marcacion -->
                                <v-dialog v-model="mostrarMarcacion" max-width="1600px" persistent scrollable>
                                    <v-card>
                                        <v-card-title>
                                            <v-toolbar flat>
                                                <v-toolbar-title>
                                                    <div class="d-flex align-center">
                                                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                                        <span>Clasificaciones del afiliado</span>
                                                    </div>
                                                </v-toolbar-title>
                                                <v-divider class="mx-4" inset vertical></v-divider>
                                            </v-toolbar>
                                            <v-btn icon @click="mostrarMarcacion = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </v-card-title>
                                        <v-card-text>
                                            <marcacion :datos="afiliado" />
                                        </v-card-text>
                                    </v-card>
                                </v-dialog>
                                <!-- Descargar certificado -->
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-if="$can('certificadoAfiliacion.descargar')" small color="success"
                                            class="mr-2" v-bind="attrs" v-on="on" @click="descargarCertificado">
                                            Certificado
                                            <v-icon right>mdi-tray-arrow-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Descargar certificado de afiliación</span>
                                </v-tooltip>

                                <!-- Grupo familiar -->
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-if="$can('grupoFamiliar.vista')" small color="primary" v-bind="attrs"
                                            v-on="on" @click="mostrarGrupoFamiliar = true">
                                            Grupo Familiar
                                            <v-icon right>mdi-account-multiple</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Consultar grupo familiar del afiliado</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container fluid>
            <v-row dense>
                <v-col cols="12" sm="6" md="3" v-if="form?.nombre_completo">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-account</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Nombre completo:</strong><br />
                            {{ form.nombre_completo }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="form?.tipo_afiliado?.nombre">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-account-circle</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Tipo de Afiliado:</strong><br />
                            {{ form.tipo_afiliado.nombre }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="form?.tipo_afiliacion?.nombre">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-shield-account</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Tipo de Afiliación:</strong><br />
                            {{ form.tipo_afiliacion.nombre }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-earth</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Etnia:</strong><br />
                            {{ form.etnia || 'Etnia no definida' }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="form?.nombre_responsable">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-account</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Responsable:</strong><br />
                            {{ form?.nombre_responsable }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-medication</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Plan:</strong> {{ form.plan || 'Sin plan asociado' }}<br />
                            <strong>Categoría:</strong> {{ form.categoria || 'Sin categoría asociada' }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-doctor</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Médico familia:</strong>
                            {{ form.medico?.operador.nombre_completo || 'Sin médico de familia asociado' }}<br />
                            <strong>Suplente:</strong> {{ form.medico2?.operador.nombre_completo || 'Sin médico defamiliasuplente asociado' }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-hazard-lights</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Riesgo:</strong>
                            {{ form.caracterizacion_afiliado?.estratificacion_riesgo || 'Sin estratificación de riesgo'}}<br />
                            <strong>Grupo:</strong> {{ form.caracterizacion_afiliado?.grupo_riesgo || 'Sin grupo deriesgo' }}
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-school</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Colegio:</strong> {{ form.colegios?.nombre || 'Sin colegio relacionado' }}
                        </div>
                    </v-card>
                </v-col>


                <template v-if="afiliadoHistoriaClinica">
                    <!-- <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-briefcase</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Ocupación:</strong><br />
                                {{ form.ocupacion || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-school-outline</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Nivel Educativo:</strong><br />
                                {{ form.nivel_educativo || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col> -->

                    <!-- <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-wheelchair</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Discapacidad:</strong><br />
                                {{ form.discapacidad || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col> -->

                    <!-- <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-access-point</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Grado Discapacidad:</strong><br />
                                {{ form.grado_discapacidad || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-ring</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Estado Civil:</strong><br />
                                {{ form.estado_civil || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-start" elevation="1">
                            <v-icon class="mr-2 mt-1" color="primary">mdi-home-city</v-icon>
                            <v-divider vertical class="mx-2"></v-divider>
                            <div style="font-size: 13px;">
                                <strong>Zona Vivienda:</strong><br />
                                {{ form.zona_vivienda || 'No definido' }}
                            </div>
                        </v-card>
                    </v-col> -->
                </template>

                <v-col cols="12" sm="6" md="3" v-if="modoDetalle || modoEdicion">
                    <v-card class="pa-2 d-flex align-start" elevation="1">
                        <v-icon class="mr-2 mt-1" color="primary">mdi-hospital-box</v-icon>
                        <v-divider vertical class="mx-2"></v-divider>
                        <div style="font-size: 13px;">
                            <strong>Equipo de cuidado integral:</strong><br />
                            <strong>Enfermería:</strong> {{ form.caracterizacion_afiliado?.usuario_enfermeria || 'Sinenfermeroasociado' }}<br />
                            <strong>Gestor:</strong> {{ form.caracterizacion_afiliado?.usuario_gestor || 'Sin gestorasociado'}}
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-card-text>
            <v-form ref="form">
                <v-switch v-model="form.esAfiliadoJudicial" label="Afiliación Judicial" dense
                    v-if="!modoDetalle"></v-switch>
                <!-- Afiliados Judiciales -->
                <v-alert v-if="form.esAfiliadoJudicial" color="blue-grey lighten-5" border="left" elevation="1" dense
                    class="py-3 px-4 mb-4" icon="mdi-gavel">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Información para afiliación judicial
                    </div>
                </v-alert>
                <v-row dense v-if="form.esAfiliadoJudicial">
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.orden_judicial" label="Orden Judicial"
                            :items="['Si', 'No']" hint="Afiliación por orden judicial"
                            :rules="[rules.requeridoEsAfiliadoJudicial]">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.orden_judicial == 'Si'">
                        <v-text-field type="number" hide-spin-buttons label="Número de folio"
                            v-model="form.numero_folio" outlined dense :rules="[rules.requeridoSiAfiliacionJudicial]"
                            hint="Número de Folio del afiliado"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.orden_judicial == 'Si'">
                        <v-text-field type="date" label="Fecha de folio" v-model="form.fecha_folio" outlined dense
                            hint="Fecha de Orden Judicial del afiliado"
                            :rules="[rules.requeridoSiAfiliacionJudicial]"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field label="Proferido" v-model="form.proferido" outlined dense
                            hint="Proferido de la orden judicial del afiliado"
                            :rules="[rules.requeridoSiAfiliacionJudicial]"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="todosMunicipios" item-text="nombre" item-value="id"
                            v-model="form.ciudad_orden_judicial" label="Ciudad de orden judicial"
                            :rules="[rules.requeridoSiAfiliacionJudicial]" />
                    </v-col>
                </v-row>
                <!-- Información de caracterización básica -->
                <v-alert color="blue-grey lighten-5" border="left" elevation="1" dense class="py-3 px-4 mb-4"
                    icon="mdi-card-account-details">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Información de caracterización básica
                    </div>
                </v-alert>
                <v-row dense>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete :loading="loading.loadingTipoDocumento" :items="tiposDocumentos"
                            item-text="nombre" item-value="id" outlined label="Tipo de Documento"
                            v-model="form.tipo_documento" dense :error-messages="errores.tipo_documento"
                            :disabled="modoDetalle" hint="Tipo de Documento del Afiliado"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="[5, 7, 9, 11].includes(form.tipo_documento)">
                        <v-text-field type="date" dense outlined v-model="form.fecha_vigencia_documento"
                            label="Fecha de vencimiento del documento"
                            hint="Fecha de vencimiento del documento extranjero"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field :rules="[rules.requerido, rules.validarNumeroDocumento]"
                            @blur="validarExistenciaAfiliado" v-model="form.numero_documento"
                            label="Número de documento" outlined dense :error-messages="errores.numero_documento"
                            hint="Número de Documento Afiliado" :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined label="Primer nombre" v-model="form.primer_nombre"
                            :rules="[rules.reglasNombres, rules.requerido]" :error-messages="errores.primer_nombre"
                            hint="Primer nombre del afiliado" :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined label="Segundo nombre" v-model="form.segundo_nombre"
                            :rules="[rules.reglasNombres]" hint="Segundo nombre del afiliado"
                            :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined label="Primer apellido" v-model="form.primer_apellido"
                            :rules="[rules.reglasNombres, rules.requerido]" hint="Primer apellido del afiliado"
                            :error-messages="errores.primer_apellido" :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined label="Segundo apellido" v-model="form.segundo_apellido"
                            :rules="[rules.reglasNombres]" hint="Segundo apellido del afiliado"
                            :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete v-model="form.sexo" :error-messages="errores.sexo" hint="Sexo del afiliado"
                            :items="[{ text: 'Masculino', value: 'M' }, { text: 'Femenino', value: 'F' }]"
                            item-text="text" item-value="value" label="Sexo" outlined dense :rules="[rules.requerido]"
                            :disabled="modoDetalle">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field type="date" label="Fecha de nacimiento" v-model="form.fecha_nacimiento"
                            :rules="[rules.requerido, rules.validarFechaNacimiento]" outlined dense
                            :error-messages="errores.fecha_nacimiento" hint="Fecha de nacimiento del afiliado"
                            @blur="validarExistenciaPorNombreFecha" :disabled="modoDetalle"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" hidden>
                        <v-text-field type="number" hide-spin-buttons label="Edad cumplida" readonly
                            v-model="form.edad_cumplida" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" hidden>
                        <v-text-field readonly v-model="form.ciclo_vida_atencion" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete :rules="[rules.requerido]" :loading="loading.loadingEntidades"
                            item-text="nombre" item-value="id" dense v-model="form.entidad_id" outlined
                            :items="entidades" label="Entidad" :error-messages="errores.entidad_id"
                            :disabled="modoDetalle"></v-autocomplete>
                    </v-col>
                </v-row>
                <!-- Información de afiliación -->
                <v-alert v-if="!modoDetalle" color="blue-grey lighten-5" border="left" elevation="1" dense
                    class="py-3 px-4 mb-4" icon="mdi-account-check">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Información de afiliación
                    </div>
                </v-alert>
                <v-row dense v-if="!modoDetalle">
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field type="date" label="Fecha de afiliación" v-model="form.fecha_afiliacion"
                            :error-messages="errores.fecha_afiliacion" :rules="[rules.requerido]" outlined
                            hint="Fecha afiliación del solicitante" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete :loading="loading.loadingTipoAfiliacion" dense outlined
                            :error-messages="errores.tipo_afiliacion_id" v-model="form.tipo_afiliacion_id"
                            label="Tipo de afiliación" :rules="[rules.requerido]" :items="tiposAfiliacion"
                            item-text="nombre" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete :loading="loading.loadingTipoAfiliado" dense outlined
                            hint="Clasificación del cotizante" :error-messages="errores.tipo_afiliado_id"
                            v-model="form.tipo_afiliado_id" label="Tipo de afiliado" :rules="[rules.requerido]"
                            :items="tipoAfiliado" item-text="nombre" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id == 1">
                        <v-autocomplete :loading="loading.tiposDocumentos" dense outlined
                            v-model="form.tipo_documento_cotizante" label="Tipo de documento del cotizante"
                            :items="tiposDocumentos" item-text="nombre" item-value="id"
                            :rules="[rules.requeridoSiEsBeneficiario]"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id == 1">
                        <v-text-field dense outlined v-model="form.numero_documento_cotizante"
                            label="Número de documento del cotizante" :rules="numeroDocumentoRules"
                            @blur="verificarEstadoCotizante">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id == 4">
                        <v-text-field type="date" dense outlined v-model="form.fecha_defuncion"
                            label="Fecha de defunción"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete v-model="form.parentesco" dense outlined :items="listaParentescos"
                            label="Parentesco" :rules="[rules.validarParentesco, rules.requeridoSiEsBeneficiario]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="form.parentesco == 'Nieto menor o igual a 60 días' || form.parentesco == 'Nieto'">
                        <v-autocomplete :items="tiposDocumentos" item-text="nombre" item-value="id" dense outlined
                            v-model="form.tipo_documento_padre_beneficiario" :rules="[rules.requeridoNieto]"
                            label="Tipo de documento del padre del beneficiario">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="form.parentesco == 'Nieto menor o igual a 60 días' || form.parentesco == 'Nieto'">
                        <v-text-field dense outlined v-model="form.numero_documento_padre_beneficiario"
                            :rules="[rules.requeridoNieto]" label="Número de documento del padre del beneficiario">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.estado_afiliacion_id" hint="Estado del afiliado"
                            :error-messages="errores.estado_afiliacion_id" label="Estado de la afiliación"
                            :items="estadoAfiliacion" :rules="[rules.requerido]" :disabled="form.tipo_afiliado_id === 4"
                            item-text="nombre" item-value="id"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id === 2">
                        <v-autocomplete dense outlined v-model="form.escalafon" :items="opcionesEscalafon"
                            item-text="nombre" item-value="id" label="Selecciona un escalafón"
                            :rules="[rules.requeridoSiEsCotizante]" hint="Escalafón Cotizante Docente"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.grupo_sanguineo" :items="opcionesGrupoSanguineo"
                            label="Grupo sanguíneo" :rules="[rules.requeridoSiEsBeneficiario]"
                            hint="Grupo sanguineo del afiliado"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.nivel_educativo" label="Nivel educativo"
                            hint="Nivel Educativo del afiliado" :rules="[rules.requerido]"
                            :error-messages="errores.nivel_educativo"
                            :items="['Analfabeta', 'Inicial', 'Preescolar', 'Primaria', 'Bachiller', 'Tecnólogo/Técnico', 'Universitario', 'Posgrado (Especialización, Maestría, Doctorado y PHD)']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id === 2">
                        <v-autocomplete dense outlined v-model="form.cargo" label="Cargo" hint="Cargo cotizante docente"
                            :items="['Docente de aula', 'Docente alumnos especiales', 'Docente funcion orientacion', 'Coordinador', 'Director rural', 'Rector', 'Director nucleo', 'Supervisor', 'Vicerector', 'Docente tutor']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id === 2">
                        <v-autocomplete dense outlined v-model="form.tipo_nombramiento" label="Tipo de nombramiento"
                            hint="Tipo de nombramiento para cotizante docente"
                            :items="['En propiedad', 'Periodo de Prueba', 'Periodo de Prueba Post Conflicto', 'Planta Temporal', 'Planta Temporal AR', 'Planta Temporal NEE', 'Planta Temporal PI', 'Planta Temporal SIMES', 'Propiedad Post Conflicto', 'Prov. Vacante Definitiva', 'Prov. Vacante Temporal']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id === 2">
                        <v-autocomplete dense outlined v-model="form.nivel_ensenanza" label="Nivel de enseñanza"
                            hint="Nivel de enseñanza cotizante docente"
                            :items="['Basica Primaria', 'Basica Secundaria y Media', 'Ciclo complementario (Normales)', 'No aplica', 'Preescolar', '(en blanco)']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id === 2">
                        <v-autocomplete dense outlined v-model="form.area_ensenanza_nombrado" label="Área de enseñanza"
                            hint="Area de enseñanza cotizante docente"
                            :items="['Areas de Apoyo para Educación Especial.', 'Ciencias Económicas y Politicas', 'Ciencias Naturales', 'Ciencias Naturales Física', 'Ciencias Naturales Química', 'Ciencias sociales', 'Educ. Artística - Artes escenicas', 'Educ. Artística - Artes plásticas', 'Educ. Artística - Danzas', 'Educ. Artística - Musica', 'Educ. Etica y Valores', 'Educ. Física, Recreación y Deporte', 'Educ. Religiosa', 'Filosofía', 'Humanidades y  Lengua Castellana', 'Idioma Extranjero Francés', 'Idioma Extranjero Inglés', 'Matemáticas', 'No aplica', 'Preescolar', 'Primaria', 'Tecnología e Informática']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.ocupacion" label="Ocupación"
                            hint="Ocupación del afiliado" :rules="[rules.requerido]" :error-messages="errores.ocupacion"
                            :items="['Empleado', 'Independiente', 'Ama de casa', 'Desempleado', 'Estudiante']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.estado_civil" label="Estado civil"
                            :rules="[rules.requerido]" hint="Estado civil del afiliado"
                            :error-messages="errores.estado_civil"
                            :items="['Soltero', 'Casado', 'Viudo', 'Divorciado', 'Separado', 'Unión Libre', 'Religioso']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.orientacion_sexual" label="Orientación sexual"
                            :rules="[rules.requerido]" :items="['Grupo LGBTIQ+', 'Ninguno']"
                            hint="Orientacion sexual del afiliado">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.identidad_genero" label="Identidad de género"
                            :rules="[rules.requerido]"
                            :items="['Hombre', 'Mujer', 'Transgenero', 'No binario', 'No desea contestar']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.sexo == 'F'">
                        <v-autocomplete dense outlined v-model="form.gestante" label="Gestante" :items="['Si', 'No']"
                            :rules="[rules.requeridoSiEsFemenino]"
                            hint="Indicar si la persona está en estado de embarazo">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.gestante == 'Si'">
                        <v-autocomplete dense outlined v-model="form.semanas_gestacion" label="Semanas de gestación"
                            :items="['0 a 13 semanas', '14 a 17 semanas', '18 a 22 semanas', '23 a 27 semanas', '28 a 31 semanas', '32 a 42 semanas']"
                            :rules="[rules.requeridoSiPositivaGestante]" hint="Semanas gestación afiliado">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.gestante == 'Si'">
                        <v-text-field type="date" dense outlined v-model="form.fecha_posible_parto"
                            label="Fecha posible parto" :rules="[rules.requeridoSiPositivaGestante]"
                            hint="Fecha posible parto del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.discapacidad" label="Discapacidad"
                            :error-messages="errores.discapacidad" hint="Tipo de discapacidad del afiliado"
                            :items="['Sin discapacidad', 'Física', 'Auditiva', 'Mental/Psíquica', 'Sordo - Ceguera', 'Visual', 'Multiple']"
                            :rules="[rules.requerido]">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.discapacidad && form.discapacidad !== 'Sin discapacidad'">
                        <v-autocomplete dense outlined v-model="form.grado_discapacidad" label="Grado de discapacidad"
                            :items="['Leve', 'Moderado', 'Severa', 'Total']" hint="Grado de discapacidad del afiliado"
                            :rules="[rules.requeridoSiEsDiscapacitado]">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.grupo_poblacional" label="Grupo poblacional"
                            hint="Grupo poblacional del afiliado"
                            :items="['Habitante de calle', 'Indigena', 'Negro, Mulato y Afrocolombiano', 'Cabeza de Familia', 'No definido', 'Rom', 'Raizal', 'Palenquero', 'Otro grupo Poblacional']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.victima_conflicto_armado"
                            label="Victima de conflicto armado"
                            :items="['Desmovilizados', 'Reincertados', 'Ninguno', 'Desplazados',]"
                            :rules="[rules.requerido]">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.etnia" label="Etnia"
                            :items="['Afrocolombiano', 'Indígena', 'Mulato', 'Raizal', 'Sin pertenencia étnica']">
                        </v-autocomplete>
                    </v-col>
                    <!-- <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined v-model="form.exento_pago" label="Exento de Pago"
                            :items="['Si', 'No']">
                        </v-autocomplete>
                    </v-col> -->
                </v-row>
                <!-- Información de ubicación de atención -->
                <v-alert v-if="!modoDetalle" color="blue-grey lighten-5" border="left" elevation="1" dense
                    class="py-3 px-4 mb-4" icon="mdi-hospital-marker">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Información de ubicación atención
                    </div>
                </v-alert>
                <v-row dense v-if="!modoDetalle">
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete :loading="loading.loadingPais" dense outlined :items="pais" item-text="nombre"
                            item-value="id" v-model="form.pais_id" label="Nacionalidad" :rules="[rules.requerido]"
                            :error-messages="errores.pais_id" hint="Nacionalidad del afiliado">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="departamentos" item-text="nombre" item-value="id"
                            v-model="form.departamento_afiliacion_id" @change="departamentosCodigo(form.departamento_afiliacion_id);
                            listarMunicipiosAfiliacion(form.departamento_afiliacion_id)"
                            label="Departamento afiliación" :rules="[rules.requerido]" clearable
                            :error-messages="errores.departamento_afiliacion_id"
                            hint="Departamento afiliación del afiliado" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field :rules="[rules.requerido]" dense outlined v-model="form.dane_departamento"
                            label="Dane departamento" readonly />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="municipios" item-text="nombre" item-value="id"
                            v-model="form.municipio_afiliacion_id" :error-messages="errores.municipio_afiliacion_id"
                            @change="municipioCodigo(form.municipio_afiliacion_id)" label="Municipio afiliación"
                            :rules="[rules.requerido]" clearable hint="Municipio afiliación del afiliado" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field :rules="[rules.requerido]" dense outlined v-model="form.dane_municipio"
                            label="Dane municipio" readonly />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="departamentos" item-text="nombre" item-value="id"
                            v-model="form.departamento_atencion_id" :error-messages="errores.departamento_atencion_id"
                            @change="listarMunicipiosAtencion(form.departamento_atencion_id); form.ips_id = null"
                            label="Departamento atención" :rules="[rules.requerido]" clearable
                            hint="Departamento atención del afiliado" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="municipioAtencion" item-text="nombre" item-value="id"
                            v-model="form.municipio_atencion_id" @change="getReps(form.municipio_atencion_id); listarSubregiones(form.municipio_atencion_id); listarGeoreferencia(form.municipio_atencion_id);
                            form.ips_id = null;" label="Municipio atención" :rules="[rules.requerido]"
                            :error-messages="errores.municipio_atencion_id" hint="Municipio atención del afiliado" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="listadoRegiones" v-model="form.region" label="Región"
                            :rules="[rules.requerido]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete dense outlined v-model="form.ips_id" :items="reps" item-text="nombre"
                            item-value="id" label="Ips Primaria" :rules="[rules.requerido]"
                            :error-messages="errores.ips_id" hint="Ips Primaria del afiliado" />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete label="Plan" :items="opcionesPlanes" v-model="form.plan" dense
                            outlined></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete label="Categoria" :items="opcionesCategorias" v-model="form.categoria" dense
                            outlined :disabled="!form.plan"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete label="Medico familia" v-model="form.medico_familia1_id"
                            :items="medicosYAuxiliares"
                            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id"
                            dense outlined @focus="traerMedicos()"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete label="Medico familia suplente" v-model="form.medico_familia2_id"
                            :items="medicosYAuxiliares"
                            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id"
                            dense outlined @focus="traerMedicos()"></v-autocomplete>
                    </v-col>
                </v-row>
                <!-- Información de contacto y localización -->
                <v-alert color="blue-grey lighten-5" border="left" elevation="1" dense class="py-3 px-4 mb-4"
                    icon="mdi-map-marker-account">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Información de contacto y localización
                    </div>
                </v-alert>

                <v-row dense>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined v-model="form.telefono" label="Teléfono"
                            hint="Número de teléfono del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field :rules="[rules.requerido, rules.celular]" dense outlined v-model="form.celular1"
                            hint="Número de celular del afiliado" label="Celular principal"
                            :error-messages="errores.celular1">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined v-model="form.celular2" label="Celular secundario"
                            hint="Número de celular del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field :rules="[rules.requerido, rules.email]" dense outlined v-model="form.correo1"
                            label="Correo principal" :error-messages="errores.correo1"
                            hint="Correo electrónico del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined v-model="form.correo2" label="Correo secundario"
                            hint="Correo electrónico del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field dense outlined v-model="form.direccion_residencia_cargue" label="Dirección"
                            :error-messages="errores.direccion_residencia_cargue"
                            hint="Dirección de correspondencia del afiliado" @click="modalDireccion = true">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="['Urbana', 'Rural']" v-model="form.zona_vivienda"
                            label="Residencia" hint="Residencia del afiliado">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="departamentos" item-text="nombre" item-value="id"
                            v-model="form.dpto_residencia_id"
                            @change="form.mpio_residencia_id = null; listarMunicipiosRecidencia(form.dpto_residencia_id); listarColegios(form.dpto_residencia_id);"
                            label="Departamento residencia">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-autocomplete dense outlined :items="municipioRecidencia" item-text="nombre" item-value="id"
                            v-model="form.mpio_residencia_id" label="Municipio residencia">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-text-field outlined dense label="Nombre del Responsable"
                            v-model="form.nombre_responsable"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-text-field outlined dense label="Teléfono del Responsable"
                            v-model="form.telefono_responsable"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-autocomplete outlined dense label="Parentesco del Responsable" :items="listaParentescos"
                            v-model="form.parentesco_responsable"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="!modoDetalle">
                        <v-autocomplete :loading="loading.loadingColegios" :items="opcionesColegios" label="Colegio"
                            :error-messages="errores.colegio_id" item-text="nombre" item-value="id"
                            v-model="form.colegio_id" dense :rules="[rules.requeridoSiEsCotizante]"
                            no-data-text="No hay colegios disponibles en el departamento de residencia seleccionado"
                            outlined></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="afiliadoHistoriaClinica">
                        <v-form ref="nombreAcompanante" lazy-validation>
                            <v-text-field dense outlined v-model="form.nombre_acompanante"
                                label="Nombre del acompañante" :rules="[rules.requerido]"
                                hint="Nombre del acompañante del afiliado">
                            </v-text-field>
                        </v-form>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="afiliadoHistoriaClinica">
                        <v-text-field dense outlined v-model="form.telefono_acompanante"
                            label="Teléfono del acompañante" :rules="[rules.requerido]"
                            hint="Teléfono del acompañante del afiliado">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-text-field outlined dense label="Ocupación" v-model="form.ocupacion"
                            hint="Ocupación del afiliado"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-autocomplete outlined dense label="Nivel educativo"
                            :items="['Ninguno', 'Preescolar', 'Primaria', 'Secundaria', 'Media', 'Técnico', 'Tecnólogo', 'Universitario', 'Postgrado']"
                            v-model="form.nivel_educativo" hint="Nivel educativo del afiliado"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-autocomplete outlined dense label="Discapacidad"
                            :items="['Física', 'Auditiva', 'Visual', 'Sordoceguera', 'Intelectual', 'Psicosocial (mental)', 'Múltiple']"
                            v-model="form.discapacidad" hint="Discapacidad del afiliado"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-autocomplete outlined dense label="Grado discapacidad" :items="['Leve', 'Moderada', 'Grave']"
                            v-model="form.grado_discapacidad"
                            hint="Grado de discapacidad del afiliado"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="modoDetalle">
                        <v-autocomplete outlined dense label="Estado civil"
                            :items="['Soltero', 'Casado', 'Unión libre', 'Separado', 'Divorciado', 'Viudo']"
                            v-model="form.estado_civil" hint="Estado civil del afiliado"></v-autocomplete>
                    </v-col>
                </v-row>
                <!-- adjuntos -->
                <v-alert v-if="!modoDetalle" color="blue-grey lighten-5" border="left" elevation="1" dense
                    class="py-3 px-4 mb-4" icon="mdi-attachment">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Adjuntos para afiliación
                    </div>
                </v-alert>

                <v-row dense v-if="!modoDetalle">
                    <v-col cols="12" sm="6" md="3"
                        v-if="form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3 || form.tipo_afiliado_id == 6">
                        <v-file-input v-model="form.ruta_adj_doc_cotizante" accept=".jpg,.png,.pdf,.xlsx,.docx" outlined
                            dense label="Fotocopia Documento Identidad Cotizante"
                            :rules="[rules.adjuntoRequeridoBase]"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3 || form.tipo_afiliado_id == 6">
                        <v-file-input v-model="form.ruta_adj_doc_beneficiario" accept=".jpg,.png,.pdf,.xlsx,.docx"
                            outlined dense label="Fotocopia Documento Identidad Beneficiario"
                            :rules="[rules.adjuntoRequeridoBase]"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" v-if="form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3">
                        <v-file-input v-model="form.ruta_adj_solic_firmada" accept=".jpg,.png,.pdf,.xlsx,.docx" outlined
                            dense label="Fotocopia Solicitud firmada por el cotizante"
                            :rules="[rules.adjuntoRequeridoBenCotDepen]"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="(form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 6) && (form.parentesco == 'Conyugue o Compañero')">
                        <v-file-input v-model="form.ruta_adj_matrimonio" accept=".jpg,.png,.pdf,.xlsx,.docx" outlined
                            dense
                            label="Fotocopia Registro Civil, Matrimonio o Declaración de Convivencia"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="(form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3 || form.tipo_afiliado_id == 6) && (form.parentesco == 'Hijo del Docente' || form.parentesco == 'Hijo Discapacitado')">
                        <v-file-input v-model="form.ruta_adj_rc_nacimiento_beneficiario"
                            accept=".jpg,.png,.pdf,.xlsx,.docx" outlined dense
                            label="Fotocopia Registro Civil de Nacimiento Beneficiario"
                            :rules="[rules.adjuntoRequeridoHijoDocente]"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="(form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3 || form.tipo_afiliado_id == 6) && (form.parentesco == 'Padre o Madre')">
                        <v-file-input v-model="form.ruta_adj_rc_nacimiento_cotizante"
                            accept=".jpg,.png,.pdf,.xlsx,.docx" outlined dense
                            label="Fotocopia Registro Civil de Nacimiento Cotizante"
                            :rules="[rules.adjuntoRequeridoPadreMadre]"></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6" md="3"
                        v-if="(form.tipo_afiliado_id == 1 || form.tipo_afiliado_id == 3 || form.tipo_afiliado_id == 6) && (form.parentesco == 'Hijo Discapacitado')">
                        <v-file-input v-model="form.ruta_adj_cert_discapacidad_hijo" accept=".jpg,.png,.pdf,.xlsx,.docx"
                            outlined dense label="Fotocopia Certificado de Incapacidad Hijo"
                            :rules="[rules.adjuntoRequeridoHijoDiscapacitado]"></v-file-input>
                    </v-col>
                </v-row>
                <!-- <v-alert v-if="!modoEdicion" color="blue-grey lighten-5" border="left" elevation="1" dense
                    class="py-3 px-4 mb-4" icon="mdi-attachment">
                    <div class="text-body-1 font-weight-medium text--secondary">
                        Archivos adjuntos del afiliado
                    </div>
                </v-alert> -->
                <v-row dense v-if="modoEdicion && this.adjuntosAfiliado.length > 0">
                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_doc_cotizante">
                        <v-btn :href="form.ruta_adj_doc_cotizante" target="_blank" color="primary" block outlined>
                            Documento Identidad Cotizante
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_doc_beneficiario">
                        <v-btn :href="form.ruta_adj_doc_beneficiario" target="_blank" color="primary" block outlined>
                            Documento Identidad Beneficiario
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_solic_firmada">
                        <v-btn :href="form.ruta_adj_solic_firmada" target="_blank" color="primary" block outlined>
                            Solicitud Firmada
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_matrimonio">
                        <v-btn :href="form.ruta_adj_matrimonio" target="_blank" color="primary" block outlined>
                            Registro Civil / Matrimonio
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_rc_nacimiento_beneficiario">
                        <v-btn :href="form.ruta_adj_rc_nacimiento_beneficiario" target="_blank" color="primary" block
                            outlined>
                            Registro Nacimiento Beneficiario
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_rc_nacimiento_cotizante">
                        <v-btn :href="form.ruta_adj_rc_nacimiento_cotizante" target="_blank" color="primary" block
                            outlined>
                            Registro Nacimiento Cotizante
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>

                    <v-col cols="12" sm="6" md="3" v-if="form.ruta_adj_cert_discapacidad_hijo">
                        <v-btn :href="form.ruta_adj_cert_discapacidad_hijo" target="_blank" color="primary" block
                            outlined>
                            Certificado Discapacidad Hijo
                            <v-icon right>mdi-download</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

            </v-form>
            <template v-if="mostrarClasificaciones">
                <v-alert v-if="form.clasificacion?.length" text dense border="left" icon="mdi-tag" color="blue-grey">
                    <strong>Clasificaciones</strong>
                </v-alert>

                <v-row dense v-if="form.clasificacion?.length">
                    <v-col cols="12">
                        <v-chip v-for="(item, i) in form.clasificacion" :key="i" :color="item.color || 'grey lighten-1'"
                            class="ma-1" label :style="{
                                maxWidth: '100%',
                                whiteSpace: 'normal',
                                color: esColorClaro(item.color) ? 'black' : 'white'
                            }">
                            <v-icon left small
                                :style="{ color: esColorClaro(item.color) ? 'black' : 'white' }">mdi-label</v-icon>
                            <strong>{{ item.nombre }}</strong>
                        </v-chip>
                    </v-col>
                </v-row>

                <v-subheader v-else class="text-center">
                    <v-icon left>mdi-information-variant-box-outline</v-icon><strong><i>Este afiliado no posee
                            clasificaciones registradas.</i></strong>
                </v-subheader>
            </template>
            <v-card-actions v-if="!afiliadoHistoriaClinica">
                <v-spacer></v-spacer>
                <v-btn small color="success" @click="modoEdicion ? actualizarFormulario() : guardarFormulario()">
                    {{ modoEdicion ? 'Actualizar Afiliado' : 'Guardar Afiliado' }}
                    <v-icon small right>{{ modoEdicion ? 'mdi-pencil' : 'mdi-content-save' }}</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card-text>
        <v-dialog v-model="subidaArchivos.estado" persistent max-width="300px">
            <v-card>
                <v-card-title class="flex justify-center">
                    Subiendo Archivos...
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12" align="center">
                            <v-progress-circular :value="subidaArchivos.porcentaje" color="primary" :rotate="360"
                                :size="100" :width="15" striped>
                                <strong>{{ Math.round(subidaArchivos.porcentaje) }}%</strong>
                            </v-progress-circular>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalDireccion" persistent width="1600">
            <DireccionAfiliadoComponente :afiliado="afiliado?.id" @cerrarModal="cerrarModalDireccion()"
                @direccionActualizada="actualizarCampoDireccion" />
        </v-dialog>

        <ModalGrupoFamiliar :mostrarGrupoFamiliar.sync="mostrarGrupoFamiliar" :afiliado="afiliado" />

    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { limpiarNombreArchivo } from "~/utils/limpiarNombreArchivo";
import generarRules from "~/utils/formularioAfiliado/rulesAfiliado";
import { opcionesEscalafon } from '~/utils/formularioAfiliado/escalafon';
import Marcacion from '~/components/aseguramiento/verificacion/Marcacion.vue';
import {
    verificarEstadoCotizante,
    validarExistenciaPorNombreFecha,
    validarExistenciaAfiliado,
    validarTipoDocumento,
    calcularEdad
} from "@/utils/formularioAfiliado/validaciones";
import DireccionAfiliadoComponente from "./DireccionAfiliadoComponente.vue";
import ModalGrupoFamiliar from "./modalGrupoFamiliar.vue";

export default {
    name: 'WorkspaceJsonFormularioAfiliadoComponente',

    components: {
        DireccionAfiliadoComponente,
        ModalGrupoFamiliar,
        Marcacion
    },
    data() {
        return {
            mostrarMarcacion: false,
            mostrarGrupoFamiliar: false,
            listadoRegiones: [
                "Región 1", "Región 2", "Región 3", "Región 4", "Región 5",
                "Región 6", "Región 7", "Región 8", "Región 9", "Región 10"
            ],
            opcionesPlanes: [
                "PAC",
                "POS",
            ],
            opcionesCategorias: [
                "A",
                "B",
                "C",
            ],
            subidaArchivos: {
                estado: false,
                porcentaje: 0
            },
            medicosYAuxiliares: [],
            cargarMedicos: false,
            cargaInicial: true,
            opcionesColegios: [],
            colegio_id: null,
            todosMunicipios: [],
            rules: {},
            errores: {},
            opcionesEscalafon,
            tiposDocumentos: [],
            entidades: [],
            tiposAfiliacion: [],
            tipoAfiliado: [],
            pais: [],
            departamento: [],
            municipio: [],
            departamentos: [],
            municipios: [],
            municipioAtencion: [],
            georeferencia: [],
            reps: [],
            subregiones: [],
            municipioRecidencia: [],
            mensajeError: "",
            listaParentescos: ['Padre o Madre', 'Hermano(a)', 'Conyugue o Compañero', 'Hijo del Docente', 'Hijo Discapacitado',
                'Hijo Conyuge', 'Nieto menor o igual a 60 días', 'Nieto', 'Menor en Custodia'
            ],
            region: [
                "Región 1",
                "Región 2",
                "Región 3",
                "Región 4",
                "Región 5",
                "Región 6",
                "Región 7",
                "Región 8",
                "Región 9",
                "Región 10",
            ],
            opcionesGrupoSanguineo: ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"],
            loading: {
                loadingTipoDocumento: false,
                loadingEntidades: false,
                loadingTipoAfiliacion: false,
                loadingTipoAfiliado: false,
                loadingPais: false,
                loadingDepartamento: false,
                loadingMunicipio: false,
                loadingDepartamentos: false,
                loadingMunicipios: false,
                loadingReps: false,
                loadingMedico: false,
                loadingColegios: false,
            },
            form: {
                esAfiliadoJudicial: false,
                tipo_documento: null,
                fecha_vigencia_documento: null,
                numero_documento: null,
                primer_nombre: null,
                segundo_nombre: null,
                primer_apellido: null,
                segundo_apellido: null,
                entidad_id: null,
                sexo: null,
                fecha_nacimiento: null,
                edad_cumplida: null,
                ciclo_vida_atencion: null,
                fecha_afiliacion: null,
                tipo_afiliacion_id: null,
                tipo_afiliado_id: null,
                tipo_documento_cotizante: null,
                numero_documento_cotizante: null,
                fecha_defuncion: null,
                parentesco: null,
                tipo_documento_padre_beneficiario: null,
                numero_documento_padre_beneficiario: null,
                estado_afiliacion_id: null,
                escalafon: null,
                grupo_sanguineo: null,
                nivel_educativo: null,
                cargo: null,
                tipo_nombramiento: null,
                nivel_ensenanza: null,
                area_ensenanza_nombrado: null,
                ocupacion: null,
                estado_civil: null,
                orientacion_sexual: null,
                identidad_genero: null,
                gestante: null,
                semanas_gestacion: null,
                fecha_posible_parto: null,
                discapacidad: null,
                grado_discapacidad: null,
                grupo_poblacional: null,
                victima_conflicto_armado: null,
                etnia: null,
                pais_id: null,
                departamento_id: null,
                municipio_id: null,
                dane_municipio: null,
                departamento_atencion_id: null,
                ips_id: null,
                region: null,
                municipio_atencion_id: null,
                telefono: null,
                celular1: null,
                celular2: null,
                correo1: null,
                correo2: null,
                direccion_residencia_cargue: null,
                direccion_residencia_via: null,
                direccion_residencia_numero_exterior: null,
                direccion_residencia_interior: null,
                direccion_residencia_barrio: null,
                direccion_residencia_numero_interior: null,
                zona_vivienda: null,
                mpio_residencia_id: null,
                dpto_residencia_id: null,
                departamento_afiliacion_id: null,
                municipio_afiliacion_id: null,
                orden_judicial: null,
                numero_folio: null,
                fecha_folio: null,
                proferido: null,
                ciudad_orden_judicial: null,
                ruta_adj_doc_cotizante: null,
                ruta_adj_doc_beneficiario: null,
                ruta_adj_solic_firmada: null,
                ruta_adj_matrimonio: null,
                ruta_adj_rc_nacimiento_beneficiario: null,
                ruta_adj_rc_nacimiento_cotizante: null,
                ruta_adj_cert_discapacidad_hijo: null,
                archivos: [],
                nombre_acompanante: null,
                telefono_acompanante: null,
                colegio_id: null,
                medico_familia1_id: null,
                medico_familia2_id: null,
                categoria: null,
                plan: null,
                nombre_responsable: null,
                telefono_responsable: null,
                parentesco_responsable: null,
            },
            adjuntosAfiliado: [],
            estadoAfiliacion: [{
                id: 1,
                nombre: "Activo",
            }, {
                id: 31,
                nombre: "Retirado",
            }, {
                id: 32,
                nombre: "Protección Laboral Cotizante",
            }, {
                id: 33,
                nombre: "Protección Laboral Beneficiario",
            },],
            modalDireccion: false,

        };
    },

    props: {
        afiliado: {},
        modoEdicion: {},
        modoDetalle: {},
        mostrarClasificaciones: {},
        afiliadoHistoriaClinica: {
            type: Boolean,
            default: false
        },
        consulta: {
            type: Object,
            default: () => ({})
        }
    },

    computed: {
        colorCicloVida() {
            switch (this.form.ciclo_vida_atencion) {
                case "Primera Infancia (0-5 Años)": return "pink lighten-2";
                case "Infancia (6-11 Años)": return "orange lighten-2";
                case "Adolescencia (12 A 17 Años)": return "deep-purple lighten-2";
                case "Joven (18 A 28 Años)": return "blue lighten-2";
                case "Adulto (29 A 59 Años)": return "green lighten-2";
                case "Vejez (Mayor a 60 Años)": return "grey lighten-1";
                default: return "grey lighten-4";
            }
        },
        iconoCicloVida() {
            switch (this.form.ciclo_vida_atencion) {
                case "Primera Infancia (0-5 Años)": return "mdi-baby";
                case "Infancia (6-11 Años)": return "mdi-human-child";
                case "Adolescencia (12 A 17 Años)": return "mdi-account-child";
                case "Joven (18 A 28 Años)": return "mdi-account";
                case "Adulto (29 A 59 Años)": return "mdi-account-tie";
                case "Vejez (Mayor a 60 Años)": return "mdi-account-outline";
                default: return "mdi-help-circle-outline";
            }
        },

        numeroDocumentoRules() {
            if (this.form.tipo_afiliado_id != 1) return [];
            return [
                v => !!v || "Este campo es obligatorio",
                v => this.form.cotizanteValido || "Debe ingresar un cotizante válido"
            ];
        },
        municipiosAfiliacion() {
            return this.municipios.filter(m => m.departamento_id === this.form.departamento_afiliacion_id);
        },
        mostrarErrorTipoDocumento() {
            return !!this.errores.tipo_documento;
        },
        mostrarErrorFechaNacimiento() {
            return !!this.errores.fecha_nacimiento;
        },
        estadoAfiliacionNombre() {
            const estados = {
                1: 'Activo',
                31: 'Retirado',
                32: 'Protección Laboral Cotizante',
            };
            return estados[this.form?.estado_afiliacion_id] || this.form?.estado_afiliacion_id;
        },
        estadoAfiliacionColor() {
            const colores = {
                1: 'green lighten-4',
                31: 'red lighten-4',
                32: 'blue lighten-4',
            };
            return colores[this.form?.estado_afiliacion_id] || 'grey lighten-4';
        },
        estadoAfiliacionTextColor() {
            const textos = {
                1: 'green darken-2',
                31: 'red darken-2',
                32: 'blue darken-2',
            };
            return textos[this.form?.estado_afiliacion_id] || 'grey darken-2';
        },
        estadoAfiliacionIcon() {
            switch (this.form?.estado_afiliacion_id) {
                case 1: return 'mdi-account-check';
                case 31: return 'mdi-account-off';
                case 32: return 'mdi-shield-account';
                default: return 'mdi-help-circle-outline';
            }
        },
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    mounted() {
        const datosAfiliado = this.obtenerDatosPorConsulta(this.consulta.id, 'Afiliados/Models/Afiliado', 'afiliado/FormularioAfiliadoComponente');

        if (datosAfiliado) {
            this.form = { ...datosAfiliado };
        } else {
            this.form.nombre_acompanante = '';
        }
        this.listartipoDocumentos();
        this.listarEntidades();
        this.listarTipoAfiliaciones();
        this.listarTipoAfiliado();
        this.listarDepartamentos();
        this.listarGeoreferencias();
        this.buscarAdjuntos();
    },

    async created() {
        if (this.afiliado) {
            this.form = { ...this.afiliado };
        }
        this.rules = generarRules(this.form, this.$axios, this.verificarConyuge, this.$swal);
        await this.listarPaises();
        await this.listarDepartamentos();

        if (this.form.departamento_atencion_id) {
            await this.listarMunicipiosAtencion(this.form.departamento_atencion_id);
        }

        if (this.form.dpto_residencia_id) {
            await this.listarMunicipiosRecidencia(this.form.dpto_residencia_id);
        }

        this.prepararCamposEdicion();
    },

    watch: {
        'form.tipo_afiliado_id'(newVal) {
            if (newVal === 4) {
                this.form.estado_afiliacion_id = 31;
            }
        },
        'form.fecha_nacimiento'(nuevaFecha) {
            calcularEdad(nuevaFecha, this.form, () => validarTipoDocumento(this.form));
        },
        'form.primer_nombre'(newValue) {
            this.form.primer_nombre = newValue ? newValue.toUpperCase() : '';
        },
        'form.segundo_nombre'(newValue) {
            this.form.segundo_nombre = newValue ? newValue.toUpperCase() : '';
        },
        'form.primer_apellido'(newValue) {
            this.form.primer_apellido = newValue ? newValue.toUpperCase() : '';
        },
        'form.segundo_apellido'(newValue) {
            this.form.segundo_apellido = newValue ? newValue.toUpperCase() : '';
        },
        'form.tipo_documento'() {
            this.aplicarFiltroPaises();
            validarTipoDocumento(this.form);
        },
        'form.departamento_afiliacion_id'(newVal) {
            this.actualizarDepartamentoAfiliacion(newVal);
            if (this.departamentos.length) {
                this.departamentosCodigo(newVal);
            }
        },
        'form.municipio_afiliacion_id'(newVal) {
            if (this.municipios.length) {
                this.municipioCodigo(newVal);
            }
        },
        'form.parentesco': {
            handler: async function (nuevoParentesco, anteriorParentesco) {
                if (nuevoParentesco === anteriorParentesco) {
                    return;
                }
                if (
                    this.modoEdicion ||
                    !nuevoParentesco ||
                    !this.form.numero_documento_cotizante ||
                    this.form.tipo_afiliado_id !== 1
                ) {
                    return;
                }

                try {
                    const response = await this.$axios.post('/afiliados/validar-parentesco', {
                        parentesco: nuevoParentesco,
                        numero_documento_cotizante: this.form.numero_documento_cotizante
                    });
                } catch (error) {
                    this.$toast.error(error.response?.data?.mensaje || 'Error al validar el parentesco');
                    this.form.parentesco = null;
                }
            }
        },
        'form.esAfiliadoJudicial'(val) {
            if (val && this.todosMunicipios.length === 0) {
                this.listarTodosMunicipios();
            }
        },
        'form.departamento_atencion': {
            handler(newVal) {
                if (newVal?.codigo_dane) {
                    this.form.dane_departamento = newVal.codigo_dane;
                }
            },
            immediate: true
        },
        'form.municipio_atencion': {
            handler(newVal) {
                if (newVal?.codigo_dane) {
                    this.form.dane_municipio = newVal.codigo_dane;
                }
            },
            immediate: true
        }
    },

    methods: {
        obtenerDatos() {
            const data = Object.fromEntries(
                Object.keys({ ...this.afiliado, ...this.form }).map(key => [
                    key,
                    this.form?.[key] ?? this.afiliado?.[key],
                ])
            );

            delete data.errores;
            delete data.tipo_documento;

            return { datos: data };
        },


        handleFileChange(event) {
            this.form.archivos = Array.from(event.target.files);
        },
        ...mapActions("app", ["setPreload"]),

        async validarExistenciaAfiliado() {
            const { $axios, $toast } = this;
            await validarExistenciaAfiliado($axios, this.form, $toast, this.rules);
        },
        async validarExistenciaPorNombreFecha() {
            const { $axios, $toast } = this;
            await validarExistenciaPorNombreFecha($axios, this.form, $toast);
        },
        async verificarEstadoCotizante() {
            const { $axios, $toast } = this;
            await verificarEstadoCotizante($axios, this.form, $toast);
        },
        validarTipoDocumento,
        listartipoDocumentos() {
            this.loading.loadingTipoDocumento = true;
            this.$axios.get("/tipo-documento/listar").then((res) => {
                this.tiposDocumentos = res.data.filter(tipo => ![6, 8, 13].includes(tipo.id));
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                this.loading.loadingTipoDocumento = false;
            });
        },

        listarEntidades() {
            this.loading.loadingEntidades = true;
            this.$axios.get("/entidad/listar").then((res) => {
                this.entidades = res.data;
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                this.loading.loadingEntidades = false;
            });
        },

        alActualizarFechaNacimiento() {
            calcularEdad(this.form.fecha_nacimiento, this.form, validarTipoDocumento);
        },

        listarTipoAfiliaciones() {
            this.loading.loadingTipoAfiliacion = true;
            this.$axios.get("tipo-afiliacion").then((res) => {
                this.tiposAfiliacion = res.data.data;
            }).catch(() => {
                console.log('No se han podido cargar los tipos de afiliación');
            }).finally(() => {
                this.loading.loadingTipoAfiliacion = false;
            });
        },

        listarTipoAfiliado() {
            this.loading.loadingTipoAfiliado = true;
            this.$axios.get("tipo-afiliados/listar").then((res) => {
                this.tipoAfiliado = res.data.data;
            }).catch(() => {
                console.log('No se han podido cargar los tipos de afiliado');
            }).finally(() => {
                this.loading.loadingTipoAfiliado = false;
            })
        },

        async listarPaises() {
            if (this.paisesOriginales?.length > 0) {
                this.aplicarFiltroPaises();
                return;
            }

            this.loading.loadingPaises = true;
            try {
                const res = await this.$axios.post("/pais/listar");
                this.paisesOriginales = res.data || [];
                this.aplicarFiltroPaises();
            } catch (error) {
                this.$toast.error(error.response?.data?.mensaje || "Error desconocido");
            } finally {
                this.loading.loadingPaises = false;
            }
        },
        aplicarFiltroPaises() {
            if (!Array.isArray(this.paisesOriginales)) {
                this.pais = [];
                return;
            }

            if ([1, 2, 3].includes(this.form.tipo_documento)) {
                this.pais = this.paisesOriginales.filter(p => p.id == 42);
            } else {
                this.pais = [...this.paisesOriginales];
            }
        },

        async listarDepartamentos() {
            this.loadingDepartamentos = true;
            try {
                const response = await this.$axios.get("/departamento/");
                this.departamentos = response.data;

                if (this.form.departamento_afiliacion_id) {
                    this.listarMunicipiosAfiliacion(this.form.departamento_afiliacion_id);
                }
            } catch (error) {
                console.error("Error al obtener departamentos:", error);
            } finally {
                this.loadingDepartamentos = false;
            }
        },

        listarMunicipiosAfiliacion(departamentoId) {
            const departamento = this.departamentos.find(dep => dep.id === departamentoId);
            this.municipios = departamento ? departamento.municipios : [];
        },

        departamentosCodigo(departamentoId) {
            const departamento = this.departamentos.find(dep => dep.id === departamentoId);
            this.form.dane_departamento = departamento ? departamento.codigo_dane : null;
        },

        municipioCodigo(municipioId) {
            const municipio = this.municipios.find(mun => mun.id === municipioId);
            this.form.dane_municipio = municipio ? municipio.codigo_dane : null;
        },

        listarMunicipiosAtencion(departamentoId) {
            if (!departamentoId) return;

            this.$axios.get(`/municipios/listar-por-departamento/${departamentoId}`).then((res) => {
                this.municipioAtencion = res.data;
            }).catch(() => {
                console.log('error al cargar los municipios de atención');

            });
        },

        obtenerDepartamento(id) {
            return this.departamento.find(item => item.id === id) || null;
        },

        obtenerMunicipio(id) {
            return this.municipio.find(item => item.id === id) || null;
        },

        actualizarDepartamentoAfiliacion(id) {
            const departamento = this.obtenerDepartamento(id);
            this.form.dane_departamento = departamento ? departamento.codigo_dane : "";
            this.municipio = departamento ? departamento.municipios || [] : [];
            this.form.municipio_afiliacion_id = null;
        },

        actualizarMunicipioAfiliacion(id) {
            const municipio = this.obtenerMunicipio(id);
            this.form.dane_municipio = municipio ? municipio.codigo_dane : "";
        },

        actualizarDepartamentoAtencion(id) {
            const departamento = this.obtenerDepartamento(id);
            this.municipioAtencion = departamento ? departamento.municipios || [] : [];
            this.form.municipio_atencion_id = null;
            this.form.ips_id = null;
        },

        listarSubregiones(municipio_id) {
            const subregion = this.subregiones.find(item => item.municipio_id == municipio_id);
            this.form.subregion_id = subregion ? subregion.id : null;
        },

        listarGeoreferencia(municipio_id) {
            const region = this.georeferencia.find(item => item.municipio_id == municipio_id);
            this.form.region = region ? region.zona : null;
        },

        listarGeoreferencias() {
            this.$axios.post("/georreferencia/listar").then((res) => {
                this.georeferencia = res.data;
                if (this.crear == false) {
                    this.listarGeoreferencia(this.afiliado.municipio_atencion_id);
                }
            })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                });
        },

        listarTodosMunicipios() {
            this.$axios.get("/municipios/listar")
                .then((res) => {
                    this.todosMunicipios = res.data;
                })
                .catch(() => {
                    console.log('error al cargar los municipios');
                });

        },

        getReps(municipioId) {
            if (!municipioId) return;

            this.loading.loadingReps = true;

            this.$axios.get(`municipios/reps/${municipioId}`).then((res) => {
                this.reps = res.data || [];

                if (this.reps.length === 0) {
                    this.$swal({
                        title: "No hay sedes",
                        text: "No hay sedes disponibles en el municipio seleccionado.",
                        type: "info",
                        confirmButtonText: "Aceptar",
                    });
                }
            }).catch(() => {
                this.$swal({
                    title: "Error",
                    text: "No se pudo listar las sedes.",
                    type: "error",
                    confirmButtonText: "Aceptar",
                });
            }).finally(() => {
                this.loading.loadingReps = false;
            });
        },

        listarMunicipiosRecidencia(departamentoId) {
            const departamento = this.departamentos.find((item) => item.id == departamentoId);
            this.municipioRecidencia = departamento ? departamento.municipios : [];
        },

        async verificarConyugeExistente() {
            try {
                const response = await this.$axios.post('/afiliados/validar-conyuge', {
                    numero_documento_cotizante: this.form.numero_documento_cotizante,
                    tipo_documento_cotizante: this.form.tipo_documento_cotizante
                });
                return response.data;
            } catch (error) {
                this.$toast.error("Error al verificar conyuge/compañero existente");
                return { existe: false, conyuges: [] };
            }
        },

        async guardarFormulario() {
            this.errores = {};

            try {
                this.setPreload(true);

                const formData = new FormData();

                const camposArchivos = [
                    'ruta_adj_doc_cotizante',
                    'ruta_adj_doc_beneficiario',
                    'ruta_adj_solic_firmada',
                    'ruta_adj_matrimonio',
                    'ruta_adj_rc_nacimiento_beneficiario',
                    'ruta_adj_rc_nacimiento_cotizante',
                    'ruta_adj_cert_discapacidad_hijo',
                ];

                for (const campo of camposArchivos) {
                    const archivo = this.form[campo];

                    if (archivo && archivo instanceof File) {
                        formData.append(campo, archivo);
                    }
                }

                for (const key in this.form) {
                    if (!camposArchivos.includes(key)) {
                        formData.append(key, this.form[key] ?? '');
                    }
                }

                const response = await this.$axios.post('/afiliados/crear', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                this.$swal({
                    type: 'success',
                    title: 'Éxito',
                    text: 'Afiliado creado correctamente',
                });

                this.$refs.form.reset();
                this.$emit('cerrarModal');
            } catch (error) {
                console.error('Error al guardar:', error);
                if (error.response?.status === 422) {
                    this.errores = error.response.data || {};
                } else {
                    const mensaje = error.response?.data?.error || error.message || 'Ocurrió un error inesperado.';
                    this.$swal({
                        type: 'error',
                        title: 'No se puede registrar el afiliado',
                        text: mensaje,
                    });
                }
            } finally {
                this.setPreload(false);
            }
        },

        actualizarFormulario() {
            this.errores = {};

            const formData = new FormData();

            for (const key in this.form) {
                let value = this.form[key] ?? '';

                if (value && typeof value === 'object' && value.id !== undefined) {
                    formData.append(key, value.id);
                } else {
                    formData.append(key, value);
                }
            }

            this.setPreload(true);

            this.$axios.post(`/afiliados/actualizarAfiliado/${this.form.id}?_method=PUT`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(response => {
                this.$swal({
                    type: 'success',
                    title: 'Éxito',
                    text: 'Afiliado actualizado correctamente',
                });
                this.$emit('cerrarModal');
            }).catch(error => {
                if (error.response && error.response.status == 422) {
                    this.errores = error.response.data || {};
                } else {
                    this.$swal({
                        type: 'error',
                        title: 'Error al intentar actualizar',
                        text: error.response.data?.error || 'Ocurrió un error inesperado.',
                    });
                }
            }).finally(() => {
                this.setPreload(false);
            });
        },

        prepararCamposEdicion() {
            const {
                departamento_atencion,
                municipio_atencion,
                municipio_afiliacion,
                municipio_residencia,
                ips,
                municipio
            } = this.form;

            if (departamento_atencion) {
                this.form.dane_departamento = departamento_atencion.codigo_dane;
            }

            if (municipio) {
                this.form.dane_municipio = municipio.codigo_dane;
            }

            if (municipio_afiliacion) {
                this.form.municipio_afiliacion_id = municipio_afiliacion.id;
            }

            if (municipio_atencion) {
                this.form.municipio_atencion_id = municipio_atencion.id;

                if (this.modoEdicion) {
                    this.form.municipio_atencion_nombre = municipio_atencion.nombre;
                }

                this.getReps(municipio_atencion.id);
                this.listarSubregiones(municipio_atencion.id);
                this.listarGeoreferencia(municipio_atencion.id);
            }

            if (ips) {
                this.form.ips_id = ips.id;
            }

            if (municipio_residencia) {
                this.form.mpio_residencia_id = municipio_residencia.id;
            }

            if (this.modoEdicion && this.afiliado?.region) {
                this.form.region = this.afiliado.region;
            }

            this.$nextTick(() => {
                this.cargaInicial = false;
            });
        },

        esColorClaro(hexColor) {
            if (!hexColor) return true

            const color = hexColor.replace('#', '')
            const r = parseInt(color.substr(0, 2), 16)
            const g = parseInt(color.substr(2, 2), 16)
            const b = parseInt(color.substr(4, 2), 16)
            const luminancia = (0.299 * r + 0.587 * g + 0.114 * b)

            return luminancia > 186
        },

        onFileChange(event, campo) {
            const file = event.target.files[0];
            if (file) {
                this.form[campo] = file;
            }
        },

        async buscarAdjuntos() {
            try {
                if (this.afiliado?.id) {
                    this.setPreload(true);
                    const afiliadoId = this.afiliado?.id;
                    const response = await this.$axios.post('afiliados/buscar-archivos/' + afiliadoId);
                    this.adjuntosAfiliado = response.data;
                    this.form.ruta_adj_doc_cotizante = response.data.ruta_adj_doc_cotizante ?? null;
                    this.form.ruta_adj_doc_beneficiario = response.data.ruta_adj_doc_beneficiario ?? null;
                    this.form.ruta_adj_solic_firmada = response.data.ruta_adj_solic_firmada ?? null;
                    this.form.ruta_adj_matrimonio = response.data.ruta_adj_matrimonio ?? null;
                    this.form.ruta_adj_rc_nacimiento_beneficiario = response.data.ruta_adj_rc_nacimiento_beneficiario ?? null;
                    this.form.ruta_adj_rc_nacimiento_cotizante = response.data.ruta_adj_rc_nacimiento_cotizante ?? null;
                    this.form.ruta_adj_cert_discapacidad_hijo = response.data.ruta_adj_cert_discapacidad_hijo ?? null;
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.setPreload(false);
            }
        },

        // validarErrores() {
        //     return this.$refs.form.validate();
        // }
        cerrarModalDireccion() {
            this.modalDireccion = false;
        },

        descargarCertificado() {
            if (!this.afiliado) {
                this.$toast.error("No hay afiliado seleccionado");
                return;
            }

            this.setPreload(true);
            const afiliado = this.afiliado;

            const data = {
                numero_documento: afiliado.numero_documento,
                tipo_documento: afiliado.tipo_documento?.nombre || '',
                primer_nombre: afiliado.primer_nombre,
                segundo_nombre: afiliado.segundo_nombre,
                primer_apellido: afiliado.primer_apellido,
                segundo_apellido: afiliado.segundo_apellido,
                estado: afiliado.estado_afiliado?.nombre || 'Activo',
                tipo_afiliado: afiliado.tipo_afiliado_id,
                ips: afiliado.ips?.nombre || '',
            };

            this.$axios.post("certificado/crear", data, { responseType: 'arraybuffer' })
                .then((res) => {
                    const blob = new Blob([res.data], { type: "application/pdf" });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `certificado_afiliado_${afiliado.numero_documento}.pdf`;
                    link.click();
                    this.$toast.success("Certificado generado con éxito");
                })
                .catch(() => {
                    this.$toast.error("Error al generar certificado");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalGrupoFamiliar() {
            this.mostrarGrupoFamiliar = true;
        },

        actualizarCampoDireccion(nuevaDireccion) {
            this.form.direccion_residencia_cargue = nuevaDireccion;
        },

        listarColegios(departamentoId) {
            this.loading.loadingColegios = true;
            this.$axios
                .get("/colegios/colegioDepartamento/" + departamentoId)
                .then((res) => {
                    this.opcionesColegios = res.data.map((colegio) => {
                        return {
                            id: colegio.id,
                            nombre: `${colegio.nombre} - ${colegio.municipio.nombre}`,
                        };
                    });
                    if (!this.opcionesColegios.length) {
                        this.$toast.info("No se encontraron colegios en este departamento.");
                    }
                })
                .catch(() => {
                    this.$swal({
                        title: "Error",
                        text: "No se pudo listar los colegios.",
                        type: "error",
                        confirmButtonText: "Aceptar",
                    });
                })
                .finally(() => {
                    this.loading.loadingColegios = false;
                });
        },


        traerMedicos() {
            if (this.cargarMedicos) return;
            this.$axios
                .get(
                    "/especialidades/listar-medicos-y-auxiliares/" + 1
                )
                .then((response) => {
                    this.medicosYAuxiliares = response.data;
                    this.cargarMedicos = true;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        validarErrores() {
            return this.$refs.nombreAcompanante.validate();
        }

    },
};

</script>
