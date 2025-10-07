<template>
	<div>
		<v-row dense>
			<v-col cols="12" sm="12" md="12">
				<v-card flat>
					<v-dialog v-model="preload" persistent width="300">
						<v-card color="primary" dark>
							<v-card-text>
								Procesando Información
								<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
							</v-card-text>
						</v-card>
					</v-dialog>

					<v-bottom-navigation color="primary" grow>
						<v-btn @click="solicitudes = true, tipoSolicitudes = false, areas = false">
							<v-icon>mdi-file-document-outline</v-icon>
							<span>Solicitudes</span>
						</v-btn>

						<v-btn
							@click="solicitudes = false, tipoSolicitudes = true, areas = false, obtenerUsuarios(), listarTipodeSolicitud()"
							v-if="$can('solicitudes.adminTipoSolicitudes')">
							<v-icon>mdi-clipboard-list-outline</v-icon>
							<span>Tipos de Solicitudes</span>
						</v-btn>

						<v-btn
							@click="solicitudes = false, tipoSolicitudes = false, areas = true, obtenerUsuarios(), listarAreas()"
							v-if="$can('solicitudes.adminTipoSolicitudes')">
							<v-icon>mdi-domain</v-icon>
							<span>Áreas</span>
						</v-btn>
					</v-bottom-navigation>

					<v-col cols="12" sm="12" md="12" v-show="solicitudes">
						<v-tabs grow centered color="white">
							<v-tabs-slider color="primary"></v-tabs-slider>
							<v-tab href="#tab-1" class="black--text"> Pendientes</v-tab>
							<v-tab href="#tab-2" class="black--text"> Solucionados</v-tab>

							<v-tab-item :value="'tab-1'">
								<v-card>
									<v-card-text>
										<v-row>
											<v-col cols="12" sm="12" md="12">
												<v-row>
													<v-col cols="12" sm="6" md="3">
														<v-select :items="estado" label="Estado" item-text="nombre"
															item-value="value" v-model="formulario.estado" dense
															:error-messages="errorsPendientes.estado">
														</v-select>
													</v-col>
													<v-col cols="12" sm="6" md="3">
														<v-text-field v-model="formulario.documento" label="Documento"
															dense>
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="3">
														<v-text-field v-model="formulario.desde" label="Desde" dense
															type="date">
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="3">
														<v-text-field v-model="formulario.hasta" label="Hasta" dense
															type="date">
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="3">
														<v-text-field v-model="formulario.radicado" label="Radicado"
															dense>
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="9">
														<v-autocomplete :items="tipoSolicitud" label="Tipo de Solicitud"
															item-text="nombre" item-value="nombre"
															v-model="formulario.tipoSolicitud" dense
															@click="listarTipodeSolicitud()">
														</v-autocomplete>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn small color="error" @click="limpiarFiltro()">
												Limpiar
											</v-btn>
											<v-btn small color="info" @click="filtrarPendientes()">
												filtrar
											</v-btn>
										</v-card-actions>

										<v-col cols="12" sm="12" md="12" v-if="listapendientes">
											<v-text-field dense v-model="buscar" prepend-icon="mdi-magnify"
												label="Buscar">
											</v-text-field>
											<v-data-table dense :headers="headersPendientes" show-select
												:items="listapendientes" loading-text="Cargando... por favor espere"
												:search="buscar" item-key="id" v-model="seleccion"
												:single-select="singleSelect">
												<template v-slot:[`item.id`]="{ item }">
													<div>
														<h3><strong class=" warning--text">
																{{ item.id }}</strong></h3>
													</div>
												</template>

												<template v-slot:[`item.gestion`]="{ item }">
													<v-menu open-on-hover right offset-y>
														<template v-slot:activator="{ on }">
															<v-icon v-on="on">mdi-menu</v-icon>
														</template>
														<v-list dense v-if="Object.keys(item.gestion).length === 0">
															<v-list-item dense>
																Gestión
															</v-list-item>
														</v-list>
														<v-list dense v-else>
															<v-list-item dense v-for="(data, index) in item.gestion"
																:key="index">
																{{ data.primer_nombre }} {{ data.primer_apellido }}
															</v-list-item>
														</v-list>
													</v-menu>
												</template>
												<template v-slot:[`item.accion`]="{ item }">
													<v-tooltip top>
														<template v-slot:activator="{ on, attrs }">
															<v-icon color="primary" small class="mr-2" v-bind="attrs"
																v-on="on" @click="abrirPendiente(item)">
																mdi-eye
															</v-icon>
														</template>
														<span>ver</span>
													</v-tooltip>
												</template>
											</v-data-table>

											<div class="text-center">
												<v-btn small rounded color="warning" dark
													@click="abrirGestion(), obtenerUsuarios()"
													v-if="$can('solicitudes.adminGestion')">
													Gestión
												</v-btn>
											</div>
										</v-col>
									</v-card-text>

									<v-dialog v-model="dialogoAcciones" v-if="dialogoAcciones" persistent width="1000">
										<v-card>
											<v-toolbar dense dark color="titulo black--text">
												<v-toolbar-title>Radicado #{{ pendientes.id }}</v-toolbar-title>
											</v-toolbar>
											<v-divider></v-divider>
											<v-card-text>
												<v-col cols="12" sm="12" md="12">
													<v-row dense>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.tipo_documento" readonly
																label="Tipo Documento">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.numero_documento" readonly
																label="Documento">
															</v-text-field>
														</v-col>

														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.primer_nombre" readonly
																label="Nombre">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.primer_apellido" readonly
																label="Apellido">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.segundo_apellido" readonly
																label="Segundo Apellido">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.telefono" readonly
																label="Télefono">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.celular1" readonly
																label="Celular">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field
																v-model="pendientes.direccion_Residencia_cargue"
																readonly label="Dirección">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.departamento" readonly
																label="Departamento">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.municipio" readonly
																label="Municipio">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.ips" readonly label="IPS">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="pendientes.nombreTipo" readonly
																label="Tipo solicitud">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12">
															<v-textarea v-model="pendientes.descripcion" readonly
																label="Descripción" auto-grow>
															</v-textarea>
															<span><strong>Fecha: </strong>
																{{ pendientes.created_at }}</span>
															<span v-if="pendientes.colaborador"><strong>Colaborador:
																</strong>
																{{ pendientes.colaborador }}</span>
														</v-col>
														<v-col cols="12" sm="12" md="12">
															<v-btn style="margin-right:7px" small
																v-for="(adjuntoR, index) in pendientes.adjunto_radicado"
																:key="index">
																<a @click="consultarAdjunto(adjuntoR.ruta)">
																	Adjunto
																	{{ index + 1 }}
																</a>
																<v-icon small color="info">mdi-file-find</v-icon>
															</v-btn>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(comenprivate, i) in comentarioPrivado"
															:key="`res2-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="info"
																	class="text-center">Comentario privado
																</v-alert>
															</v-col>
															<v-textarea v-model="comenprivate.motivo" readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong>Nombre: </strong> {{
																comenprivate.primer_nombre }}
																{{ comenprivate.primer_apellido }}
																<strong>Fecha: </strong>
																{{ comenprivate.created_at }}
															</span>
															<v-col cols="12" sm="12" md="12">
																<v-btn style="margin-right:7px" small
																	v-for="(data, index4) in comenprivate.adjuntos_gestion"
																	:key="index4">
																	<a @click="consultarAdjunto(data.ruta)">
																		Adjunto
																		{{ index4 + 1 }}
																	</a>
																	<v-icon small color="info">mdi-file-find</v-icon>
																</v-btn>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(comenpublic, i) in comentarioPublico"
															:key="`res1-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="info"
																	class="text-center">Comentario
																</v-alert>
															</v-col>
															<v-textarea dense auto-grow v-model="comenpublic.motivo"
																readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong v-if="comenpublic.primer_nombre">Nombre:
																</strong>
																{{ comenpublic.primer_nombre }}
																{{ comenpublic.primer_apellido }}
																<strong v-if="!comenpublic.primer_nombre">Paciente
																</strong>
																<strong>Fecha: </strong>
																{{ comenpublic.created_at }}
															</span>
															<v-col cols="12" sm="12" md="12">
																<v-btn style="margin-right:7px" small
																	v-for="(data, index3) in comenpublic.adjuntos_gestion"
																	:key="index3">
																	<a @click="consultarAdjunto(data.ruta)">
																		Adjunto
																		{{ index3 + 1 }}
																	</a>
																	<v-icon small color="info">mdi-file-find</v-icon>
																</v-btn>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(dev, i) in devoluciones" :key="`dev-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="warning"
																	class="text-center">Devolución
																</v-alert>
															</v-col>
															<v-textarea v-model="dev.motivo" readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong>Nombre: </strong> {{ dev.primer_nombre }}
																{{ dev.primer_apellido }}
																<strong>Fecha: </strong>
																{{ dev.created_at }}
															</span>
														</v-col>
													</v-row>
												</v-col>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn small color="error" @click="dialogoAcciones = false">
													Cerrar
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>

									<v-dialog v-model="dialogGestion" v-if="dialogGestion" persistent width="800">
										<v-card>
											<v-toolbar dense dark color="titulo black--text">
												<v-toolbar-title>Gestión</v-toolbar-title>
											</v-toolbar>
											<v-card-text>
												<v-col cols="12" sm="12" md="12">
													<v-row dense>
														<v-col cols="12" sm="6" md="6">
															<v-select v-model="formularioGestion.tipo"
																:items="tipoGestion" label="Tipo gestión"
																:error-messages="errorsGestion.tipo">
															</v-select>
														</v-col>
														<v-col cols="12" sm="12" md="12" v-if="seleccion.length > 0">
															<v-col cols="12" sm="12" md="12">
																<v-autocomplete readonly v-model="seleccion"
																	:items="seleccion" item-text="id" item-value="id"
																	label="Radicado" multiple>
																</v-autocomplete>
															</v-col>
															<v-col cols="12" sm="12" md="12"
																v-if="formularioGestion.tipo != 'Devolver'">
																<v-autocomplete v-model="formularioGestion.usuarios"
																	:items="usuarios" item-text="nombre"
																	item-value="user_id" label="Usuario" multiple
																	deletable-chips chips>
																</v-autocomplete>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12" v-else>
															<v-col cols="12" sm="12" md="12">
																<v-autocomplete v-model="formularioGestion.delUsuario"
																	:items="usuarios"
																	:error-messages="errorsGestion.delusuario_id"
																	item-text="nombre" item-value="user_id"
																	label="Del usuario" multiple deletable-chips chips>
																</v-autocomplete>
															</v-col>
															<v-col cols="12" sm="12" md="12"
																v-show="formularioGestion.tipo != 'Devolver'">
																<v-autocomplete v-model="formularioGestion.alUsuario"
																	:items="usuarios" item-text="nombre"
																	item-value="user_id" label="Al usuario" multiple
																	deletable-chips chips>
																</v-autocomplete>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-show="formularioGestion.tipo == 'Devolver'">
															<v-textarea label="Motivo"
																v-model="formularioGestion.motivo" dense auto-grow>
															</v-textarea>
														</v-col>
													</v-row>
												</v-col>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn small color="error" @click="cerrarGestion()">
													Cerrar
												</v-btn>
												<v-btn small color="success" @click="guardarGestion()">
													Guardar
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-card>
							</v-tab-item>

							<v-tab-item :value="'tab-2'">
								<v-card>
									<v-card-text>
										<v-row>
											<v-col cols="12" sm="12" md="12">
												<v-row>
													<v-col cols="12" sm="6" md="3">
														<v-text-field label="Desde" type="date" color="primary" dense
															v-model="solucionadas.fechaDesde"
															:error-messages="errorsSolucionadas.fechaDesde">
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="3">
														<v-text-field label="Hasta" type="date" color="primary" dense
															v-model="solucionadas.fechaHasta"
															:error-messages="errorsSolucionadas.fechaHasta">
														</v-text-field>
													</v-col>
													<v-col cols="12" sm="6" md="6">
														<v-autocomplete :items="tipoSolicitud" label="Tipo de Solicitud"
															item-text="nombre" item-value="nombre"
															v-model="solucionadas.tipoSolicitud" dense
															@click="listarTipodeSolicitud()">
														</v-autocomplete>
													</v-col>
													<v-col cols="12" sm="6" md="4">
														<v-autocomplete :items="departamentos" label="Departamento"
															item-text="nombre" item-value="id"
															v-model="solucionadas.departamento" dense>
														</v-autocomplete>
													</v-col>
													<v-col cols="12" sm="6" md="4">
														<v-autocomplete :items="municipios" label="Municipio"
															item-text="nombre" item-value="id"
															v-model="solucionadas.municipio" dense>
														</v-autocomplete>
													</v-col>
													<v-col cols="12" sm="6" md="4">
														<v-text-field label="Documento" dense
															v-model="solucionadas.documento">
														</v-text-field>
													</v-col>
												</v-row>
											</v-col>
										</v-row>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn small color="error" @click="limpiarFiltroSolucionadas()">
												Limpiar
											</v-btn>
											<v-btn small color="info" @click="filtrarSolucionadas()">
												filtrar
											</v-btn>
										</v-card-actions>

										<v-col cols="12" sm="12" md="12" v-if="listaSolucionados">

											<v-data-table dense :headers="headersSolucionados"
												:items="listaSolucionados" hide-default-footer
												loading-text="Cargando... por favor espere">
												<template v-slot:[`item.accion`]="{ item }">
													<v-tooltip top>
														<template v-slot:activator="{ on, attrs }">
															<v-icon color="primary" small class="mr-2" v-bind="attrs"
																v-on="on" @click="abrirSolucionadas(item)">
																mdi-eye
															</v-icon>
														</template>
														<span>ver</span>
													</v-tooltip>
												</template>
											</v-data-table>
											<v-row no-gutters>
												<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
													<v-pagination v-model="pagina" class="my-4" :length="total"
														:total-visible="9" @input="filtrarSolucionadas()">
													</v-pagination>
												</v-col>
												<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols
													style="min-width: 100px">
													<v-select class="my-4" v-model="opcionActual" :items="opciones"
														dense solo small @change="filtrarSolucionadas()">
													</v-select>
												</v-col>
											</v-row>
										</v-col>
									</v-card-text>

									<v-dialog v-model="dialogoSolucionados" v-if="dialogoSolucionados" persistent
										width="1000">
										<v-card>
											<v-toolbar dense dark color="titulo black--text">
												<v-toolbar-title>Radicado #{{ solucionados.id }}</v-toolbar-title>
											</v-toolbar>
											<v-divider></v-divider>
											<v-card-text>
												<v-col cols="12" sm="12" md="12">
													<v-row dense>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.tipo_documento" readonly
																label="Tipo Documento">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.numero_documento"
																readonly label="Documento">
															</v-text-field>
														</v-col>

														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.primer_nombre" readonly
																label="Nombre">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.primer_apellido"
																readonly label="Apellido">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.segundo_apellido"
																readonly label="Segundo Apellido">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.telefono" readonly
																label="Télefono">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.celular1" readonly
																label="Celular">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field
																v-model="solucionados.direccion_Residencia_cargue"
																readonly label="Dirección">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.departamento" readonly
																label="Departamento">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.municipio" readonly
																label="Municipio">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.ips" readonly
																label="IPS">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="6" md="3">
															<v-text-field v-model="solucionados.nombreTipo" readonly
																label="Tipo solicitud">
															</v-text-field>
														</v-col>
														<v-col cols="12" sm="12" md="12">
															<v-textarea v-model="solucionados.descripcion" readonly
																label="Descripción" auto-grow>
															</v-textarea>
															<span><strong>Fecha: </strong>
																{{ solucionados.created_at }}</span>
															<span v-if="solucionados.colaborador"><strong>Colaborador:
																</strong>
																{{ solucionados.colaborador }}</span>
														</v-col>
														<v-col cols="12" sm="12" md="12">
															<v-btn style="margin-right:7px" small
																v-for="(adjuntoR, index) in solucionados.adjunto_radicado"
																:key="index">
																<a @click="consultarAdjunto(adjuntoR.ruta)">
																	Adjunto
																	{{ index + 1 }}
																</a>
																<v-icon small color="info">mdi-file-find</v-icon>
															</v-btn>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(comenprivate, i) in comentarioPrivado"
															:key="`res2-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="info"
																	class="text-center">Comentario privado
																</v-alert>
															</v-col>
															<v-textarea v-model="comenprivate.motivo" readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong>Nombre: </strong> {{
																comenprivate.primer_nombre }}
																{{ comenprivate.primer_apellido }}
																<strong>Fecha: </strong>
																{{ comenprivate.created_at }}
															</span>
															<v-col cols="12" sm="12" md="12">
																<v-btn style="margin-right:7px" small
																	v-for="(data, index4) in comenprivate.adjuntos_gestion"
																	:key="index4">
																	<a @click="consultarAdjunto(data.ruta)">
																		Adjunto
																		{{ index4 + 1 }}
																	</a>
																	<v-icon small color="info">mdi-file-find</v-icon>
																</v-btn>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(comenpublic, i) in comentarioPublico"
															:key="`res1-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="info"
																	class="text-center">Comentario
																</v-alert>
															</v-col>
															<v-textarea dense auto-grow v-model="comenpublic.motivo"
																readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong v-if="comenpublic.primer_nombre">Nombre:
																</strong>
																{{ comenpublic.primer_nombre }}
																{{ comenpublic.primer_apellido }}
																<strong v-if="!comenpublic.primer_nombre">Paciente
																</strong>
																<strong>Fecha: </strong>
																{{ comenpublic.created_at }}
															</span>
															<v-col cols="12" sm="12" md="12">
																<v-btn style="margin-right:7px" small
																	v-for="(data, index3) in comenpublic.adjuntos_gestion"
																	:key="index3">
																	<a @click="consultarAdjunto(data.ruta)">
																		Adjunto
																		{{ index3 + 1 }}
																	</a>
																	<v-icon small color="info">mdi-file-find</v-icon>
																</v-btn>
															</v-col>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(dev, i) in devoluciones" :key="`dev-${i}`">
															<v-col cols="12" sm="12" md="12" v-if="i < 1">
																<v-alert dense text outlined color="warning"
																	class="text-center">Devolución
																</v-alert>
															</v-col>
															<v-textarea v-model="dev.motivo" readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong>Nombre: </strong> {{ dev.primer_nombre }}
																{{ dev.primer_apellido }}
																<strong>Fecha: </strong>
																{{ dev.created_at }}
															</span>
														</v-col>
														<v-col cols="12" sm="12" md="12">
															<v-alert dense text outlined color="info"
																class="text-center">Respuesta
															</v-alert>
														</v-col>
														<v-col cols="12" sm="12" md="12"
															v-for="(res, i) in solucionados.gestion" :key="`res-${i}`">
															<v-textarea dense auto-grow v-model="res.motivo" readonly>
																<template v-slot:label>
																	<div>MOTIVO</div>
																</template>
															</v-textarea>
															<span><strong>Nombre: </strong> {{ res.primer_nombre }}
																{{ res.primer_apellido }}
																<strong>Fecha: </strong>
																{{ res.created_at }}
															</span>
															<v-col cols="12" sm="12" md="12">
																<v-btn style="margin-right:7px" small
																	v-for="(data, index3) in res.adjuntos_gestion"
																	:key="index3">
																	<a @click="consultarAdjunto(data.ruta)">
																		Adjunto
																		{{ index3 + 1 }}
																	</a>
																	<v-icon small color="info">mdi-file-find</v-icon>
																</v-btn>
															</v-col>
														</v-col>
													</v-row>
												</v-col>
											</v-card-text>
											<v-card-actions>
												<v-spacer></v-spacer>
												<v-btn small color="error" @click="dialogoSolucionados = false">
													Cerrar
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-dialog>
								</v-card>
							</v-tab-item>
						</v-tabs>
					</v-col>

					<v-col cols="12" sm="12" md="12" v-show="tipoSolicitudes">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-card-title>
									<v-btn tile small color="success"
										@click="dialogoCrearSolicitud = true, guardarTipoSolicitud = true, formularioSolicitud = { descripcion: '' }">
										Crear tipo solicitud
										<v-icon right>
											mdi-plus-circle-outline
										</v-icon>
									</v-btn>
									<v-spacer></v-spacer>
									<v-text-field v-model="buscarTipoSolicitud" dense append-icon="mdi-magnify"
										label="Buscar" single-line hide-details>
									</v-text-field>
								</v-card-title>
								<v-data-table disable-pagination dense :headers="headers" :items="tipoSolicitud"
									hide-default-footer loading-text="Cargando... por favor espere">
									<template v-slot:[`item.activo`]="{ item }">
										<v-chip small :color="chipsEstado(item.activo)" dark label>
											{{ item.activo == '1' ? 'Activo' : 'Inactivo' }}</v-chip>
									</template>

									<template v-slot:[`item.accion`]="{ item }">
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
													@click="editarTipoSolicitud(item)">
													mdi-pencil
												</v-icon>
											</template>
											<span>Editar</span>
										</v-tooltip>

										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
													@click="confirmacionCambioEstado(item)">
													mdi-list-status
												</v-icon>
											</template>
											<span>{{ item.activo == true ? 'Inactivar' : 'Activar' }}</span>
										</v-tooltip>
									</template>
								</v-data-table>
								<v-row no-gutters>
									<v-col md="9" lg="9" xl="11" sm="11" class="px-2">
										<v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
											@input="listarTipodeSolicitud">
										</v-pagination>
									</v-col>
									<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
										<v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
											@change="listarTipodeSolicitud">
										</v-select>
									</v-col>
								</v-row>
							</v-col>

						</v-row>

						<v-dialog v-model="dialogoEstado" max-width="800px">
							<v-card>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn small color="error" dark @click="cerrarModalConfirmacion()">Cancelar</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-col>

					<v-col cols="12" sm="12" md="12" v-show="areas">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-card-title>
									<v-btn tile small color="success" @click="dialogoCrearArea = true">
										<v-icon left>
											mdi-plus-box
										</v-icon>
										Crear Area
									</v-btn>
									<v-spacer></v-spacer>
									<v-text-field v-model="buscarArea" dense append-icon="mdi-magnify" label="Buscar"
										single-line hide-details>
									</v-text-field>
								</v-card-title>
								<v-data-table :loading="loading" :disable="loading" dense :headers="headersArea"
									:items="listaAreas" :search="buscarArea"
									loading-text="Cargando... por favor espere">


									<template v-slot:[`item.accion`]="{ item }">
										<v-tooltip top>
											<template v-slot:activator="{ on, attrs }">
												<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
													@click="editarArea(item)">
													mdi-pencil
												</v-icon>
											</template>
											<span>Editar</span>
										</v-tooltip>
									</template>
									<template v-slot:[`item.responsables`]="{ item }">
										<td>
											<v-menu open-on-hover right offset-y>
												<template v-slot:activator="{ on }">
													<v-icon right color="info" v-on="on">mdi-account-badge-outline
													</v-icon>
												</template>
												<v-list dense>
													<v-list-item dense v-for="(data, index) in item.user" :key="index">
														<v-list-item-content>{{ data.operador.nombre_completo }}
														</v-list-item-content>
													</v-list-item>
												</v-list>
											</v-menu>
										</td>
									</template>
								</v-data-table>
							</v-col>

						</v-row>
					</v-col>

					<v-dialog v-model="dialogoCrearSolicitud" persistent max-width="900px">
						<v-card>
							<v-alert text dense dark type="info" border="left">
								<v-toolbar-title v-if="guardarTipoSolicitud">Crear tipo solicitud</v-toolbar-title>
								<v-toolbar-title v-else>Editar tipo solicitud</v-toolbar-title>
							</v-alert>
							<v-card-text>
								<v-col cols="12" sm="12" md="12">
									<v-row dense>
										<v-col cols="12" sm="6" md="4">
											<v-text-field v-model="formularioSolicitud.nombre" label="Nombre"
												:readonly="!guardarTipoSolicitud" :error-messages="errors.nombre">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-select label="Opción 1" v-model="formularioSolicitud.opcion1"
												:error-messages="errors.opcion1"
												:items="['Medico Familia', 'Gestión', 'Usuario']">
											</v-select>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-select label="Opción 2" v-model="formularioSolicitud.opcion2"
												:items="['Gestión', 'Usuario']"
												v-show="formularioSolicitud.opcion1 == 'Medico Familia'"
												:error-messages="errors.opcion2">
											</v-select>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea auto-grow v-model="formularioSolicitud.descripcion" dense
												label="Descripción" rows="2" :error-messages="errors.descripcion">
											</v-textarea>
										</v-col>


										<v-col cols="12" sm="12" md="12"
											v-if="(!guardarTipoSolicitud) && (formularioSolicitud.opcion1 == 'Usuario' || formularioSolicitud.opcion2 == 'Usuario')">
											<v-alert text dense border="left" icon="mdi-account-badge"
												color="blue-grey">Usuarios</v-alert>

											<v-autocomplete :items="usuarios" label="Agregar Usuario" item-text="nombre"
												item-value="user_id" deletable-chips small-chips
												v-model="formularioSolicitud.empleados" multiple>
											</v-autocomplete>
											<v-text-field dense v-model="buscarEmpleado" prepend-icon="mdi-magnify"
												label="Buscar">
											</v-text-field>
											<v-data-table dense :headers="headersEmpleado"
												:items="tipoSolicitudEmpleado" hide-default-footer
												loading-text="Cargando... por favor espere" :search="buscarEmpleado">
												<template v-slot:[`item.accion`]="{ item }">
													<v-tooltip top>
														<template v-slot:activator="{ on, attrs }">
															<v-icon color="error" small class="mr-2" v-bind="attrs"
																v-on="on" @click="inactivarEmpleado(item)">
																mdi-delete
															</v-icon>
														</template>
														<span>Inactivar</span>
													</v-tooltip>
												</template>
											</v-data-table>
											<v-row no-gutters>
												<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
													<v-pagination v-model="pagina" class="my-4" :length="total"
														:total-visible="9"
														@input="obtenerTipoEmpleado(tipoSolicitudEmpleado[0].idTipo)">
													</v-pagination>
												</v-col>
												<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols
													style="min-width: 100px">
													<v-select class="my-4" v-model="opcionActual" :items="opciones"
														dense solo small
														@change="obtenerTipoEmpleado(tipoSolicitudEmpleado[0].idTipo)">
													</v-select>
												</v-col>
											</v-row>
										</v-col>

										<v-col cols="12" sm="12" md="12" v-if="(!guardarTipoSolicitud)">
											<v-alert text dense border="left" icon="mdi-hospital-building"
												color="blue-grey">Entidades</v-alert>

											<v-autocomplete :items="listaEntidades" label="Limitar a entidad" dense
												item-text="nombre" item-value="id" deletable-chips small-chips
												v-model="formularioSolicitud.entidades" multiple>
											</v-autocomplete>
											<v-text-field dense v-model="buscarEntidad" prepend-icon="mdi-magnify"
												label="Buscar">
											</v-text-field>
											<v-data-table dense :headers="headersEntidades"
												:items="entidadesRelacionadas" hide-default-footer
												loading-text="Cargando... por favor espere" :search="buscarEntidad">
											</v-data-table>
											<v-row no-gutters>
												<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
													<v-pagination v-model="pagina" class="my-4" :length="total"
														:total-visible="9" @input="listarEntidades()">
													</v-pagination>
												</v-col>
												<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols
													style="min-width: 100px">
													<v-select class="my-4" v-model="opcionActual" :items="opciones"
														dense solo small @change="listarEntidades()">
													</v-select>
												</v-col>
											</v-row>
										</v-col>
									</v-row>
								</v-col>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn small color="error" @click="dialogoCrearSolicitud = false">Cerrar
								</v-btn>
								<v-btn small v-if="guardarTipoSolicitud" @click="guardarSolicitud()" color="success">
									Guardar
								</v-btn>
								<v-btn v-else small @click="actualizarSolicitud()" color="warning">Actualizar</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<v-dialog v-model="dialogoCrearArea" persistent max-width="700px">
						<v-card>
							<v-toolbar dense dark color="titulo black--text">
								<v-toolbar-title>Crear area</v-toolbar-title>
							</v-toolbar>
							<v-divider></v-divider>
							<v-card-text>
								<v-col cols="12" sm="12" md="12">
									<v-row dense>
										<v-col cols="6" sm="6" md="6">
											<v-text-field v-model="formularioArea.nombre" label="Nombre">
											</v-text-field>
										</v-col>

										<v-col cols="6" sm="6" md="6">
											<v-autocomplete :items="usuarios" label="Usuario"
												item-text="nombre_completo" item-value="user_id" deletable-chips
												small-chips v-model="formularioArea.user_id" multiple>
											</v-autocomplete>

										</v-col>
									</v-row>
								</v-col>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn small color="error" @click="dialogoCrearArea = false">Cerrar
								</v-btn>
								<v-btn small @click="guardarArea()" color="success">Guardar
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<v-dialog v-model="dialogEditarArea" persistent max-width="900px" v-if="dialogEditarArea">
						<v-card>
							<v-alert text dense border="left" type="info">
								<span>Editar area</span>
							</v-alert>
							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field dense v-model="datosArea.nombre" label="Nombre">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="8">
											<v-autocomplete small-chips :items="usuarios" dense
												v-model="datosArea.user_id" item-text="nombre_completo"
												item-value="user_id" multiple deletable-chips chips label="usuario">
											</v-autocomplete>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn small color="red" dark @click="dialogEditarArea = false">
									Cerrar
								</v-btn>
								<v-btn small color="success" dark @click="actualizarArea(datosArea)">
									Guardar
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

				</v-card>
			</v-col>

		</v-row>
	</div>
</template>

<script>
	export default {
		middleware({
			$can,
			redirect
		}) {
			if (!$can('solicitudes.menu')) {
				return redirect('/');
			}
		},
		name: 'WorkspaceJsonParametrizacion',

		data() {
			return {
				listaAreas: [],
				formularioArea: {},
				dialogoCrearArea: false,
				buscarArea: '',
				areas: false,
				errorsSolucionadas: {
					fechaDesde: '',
					fechaHasta: ''
				},
				singleSelect: false,
				seleccion: [],
				buscar: '',
				loading: false,
				estado: [{
						value: 10,
						nombre: 'Pendientes'
					},
					{
						value: 18,
						nombre: 'Gestionando'
					},
				],
				tipoGestion: [
					'Reasignar', 'Compartir', 'Devolver'
				],
				preload: false,
				pagina: 1,
				total: 0,
				opcionActual: 5,
				opciones: [5, 10, 20, 50, 100],
				tipoSolicitudes: false,
				solicitudes: false,
				dialogoCrearSolicitud: false,
				guardarTipoSolicitud: false,
				formularioSolicitud: {
					descripcion: '',
					empleados: '',
					entidades: '',
				},
				formulario: {
					estado: '',
					documento: '',
					desde: '',
					hasta: '',
					radicado: '',
					tipoSolicitud: ''
				},
				buscarTipoSolicitud: '',
				buscarEmpleado: '',
				buscarEntidad: '',
				usuarios: [],
				listaEntidades: [],
				entidadesRelacionadas: [],
				tipoSolicitud: [],
				tipoSolicitudEmpleado: [],
				headersEmpleado: [{
						text: 'id',
						align: 'left',
						value: 'id'
					},
					{
						text: 'Documento',
						align: 'left',
						value: 'documento'
					},
					{
						text: 'Nombre',
						align: 'left',
						value: 'nombre'
					},
					{
						text: 'Acciones',
						align: 'center',
						value: 'accion',
						sortable: false
					}
				],
				headersEntidades: [{
						text: 'id',
						align: 'left',
						value: 'id'
					},
					{
						text: 'Nombre',
						align: 'left',
						value: 'nombre'
					},
				],
				headers: [{
						text: 'id',
						align: 'left',
						value: 'id'
					},
					{
						text: 'Nombre',
						align: 'left',
						value: 'nombre'
					},
					{
						text: 'Descripción',
						align: 'left',
						value: 'descripcion'
					},
					{
						text: 'Estado',
						align: 'left',
						value: 'activo'
					},
					{
						text: 'Editar',
						align: 'left',
						value: 'accion',
						sortable: false
					}
				],
				headersPendientes: [{
						text: "Radicado",
						align: "left",
						value: "id",
					},
					{
						text: "gestion",
						align: "left",
						value: 'gestion'
					},
					{
						text: "Fecha",
						align: "left",
						value: 'created_at'
					},
					{
						text: "Documento",
						align: "left",
						sortable: false,
						value: 'numero_documento'
					},
					{
						text: "Nombre",
						align: "left",
						sortable: false,
						value: 'nombreAfiliado'
					},
					{
						text: "Departamento",
						align: "left",
						value: "departamento",
					},
					{
						text: "Municipio",
						align: "left",
						value: "municipio",
					},
					{
						text: "IPS",
						align: "center",
						value: "ips",
					},
					{
						text: "Solicitud",
						align: "left",
						value: 'nombreTipo'
					},
					{
						text: "Estado",
						align: "left",
						value: 'estado'
					},
					{
						text: "Acciones",
						align: "center",
						sortable: false,
						value: 'accion'
					},
				],
				headersSolucionados: [{
						text: "Radicado",
						align: "left",
						value: "id",
					},
					{
						text: "Fecha",
						align: "left",
						value: 'created_at'
					},
					{
						text: "Documento",
						align: "left",
						sortable: false,
						value: 'numero_documento'
					},
					{
						text: "Nombre",
						align: "left",
						sortable: false,
						value: 'nombreAfiliado'
					},
					{
						text: "Departamento",
						align: "left",
						value: "departamento",
					},
					{
						text: "Municipio",
						align: "left",
						value: "municipio",
					},
					{
						text: "IPS",
						align: "center",
						value: "ips",
					},
					{
						text: "Solicitud",
						align: "left",
						value: 'nombreTipo'
					},
					{
						text: "Estado",
						align: "left",
						value: 'estado'
					},
					{
						text: "Acciones",
						align: "center",
						sortable: false,
						value: 'accion'
					},
				],
				headersArea: [{
						text: "id",
						align: "left",
						value: 'id'
					},
					{
						text: "Nombre",
						align: "start",
						value: 'nombre'
					},
					{
						text: 'Responsable',
						value: 'responsables',
						align: 'start',
						sortable: false,
					},
					{
						text: "Acciones",
						align: "center",
						sortable: false,
						value: 'accion'
					},
				],
				errors: {
					nombre: '',
					descripcion: '',
					opcion1: '',
					opcion2: ''
				},
				listapendientes: null,
				errorsPendientes: {
					estado: ''
				},
				dialogoAcciones: false,
				pendientes: [],
				comentarioPublico: [],
				comentarioPrivado: [],
				devoluciones: [],
				dialogGestion: false,
				formularioGestion: {
					tipo: '',
					motivo: ''
				},
				errorsGestion: {
					tipo: '',
					delusuario_id: ''
				},
				solucionadas: {
					fechaDesde: '',
					fechaHasta: '',
					tipoSolicitud: '',
					departamento: '',
					municipio: '',
					documento: '',
				},
				departamentos: [],
				municipios: [],
				listaSolucionados: null,
				solucionados: [],
				dialogoSolucionados: false,
				datosArea: {
					user_id: []
				},
				dialogEditarArea: false,
				dialogoEstado: false,
			};
		},

		mounted() {
			this.listarDepartamento()
			this.listarMunicipio()
			this.listarEntidades();
		},

		methods: {
			listarDepartamento() {
				this.$axios.get('departamento/').then(res => {
					this.departamentos = res.data
				}).catch(e => {})
			},

			listarMunicipio() {
				this.$axios.get('municipios/listar').then(res => {
					this.municipios = res.data
				}).catch(e => {})
			},

			obtenerUsuarios() {
				this.$axios.get('/operador/listarActivos').then(res => {
					this.usuarios = res.data
				}).catch(e => {
					console.log(e);
				})
			},

			guardarSolicitud() {
				this.limpiarError()
				this.preload = true
				this.$axios.post('tipo-solicitud-red-vital/guardarTipoSolicitud', this.formularioSolicitud).then(res => {
					this.$toast.success('Tipo de solicitud creada con exito')
					this.preload = false
					this.dialogoCrearSolicitud = false
					this.listarTipodeSolicitud()
				}).catch(error => {
					this.preload = false
					if (error.response.data.mensaje) {
						this.$toast.error(error.response.data.mensaje)
					} else if (error.response.data) {
						this.ErrorEntrada(error.response.data)
					}

				})
			},

			ErrorEntrada(errors) {
				for (const key in this.errors) {
					if (key in errors) {
						this.errors[key] = errors[key].join(',')
					}
				}
			},

			limpiarError() {
				for (const key in this.errors) {
					this.errors[key] = ''
				}
			},

			listarTipodeSolicitud() {
				this.preload = true
				this.$axios.get('tipo-solicitud-red-vital/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual)
					.then(
						res => {
							this.tipoSolicitud = res.data.data
							this.total = res.data.last_page
							this.preload = false
						}).catch(e => {
						this.preload = false
					})
			},

			chipsEstado(estado) {
				if (estado == true) return 'success'
				else if (estado == false) return 'error'
				else return 'warning'
			},

			obtenerTipoEmpleado(tipoSolicitud) {
				this.preload = true
				this.$axios.post('tipo-solicitud-empleado/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
					id: tipoSolicitud
				}).then(res => {
					this.tipoSolicitudEmpleado = res.data.data
					this.total = res.data.last_page
					this.preload = false
				}).catch(e => {
					this.preload = false
				})
			},

			editarTipoSolicitud(tipoSolicitud) {
				this.formularioSolicitud = tipoSolicitud
				this.formularioSolicitud.empleados = ''
				this.formularioSolicitud.entidades = ''
				this.dialogoCrearSolicitud = true
				this.guardarTipoSolicitud = false
				this.obtenerTipoEmpleado(tipoSolicitud.id)
				this.obtenerEntidadesLimitadas(tipoSolicitud.id)
			},

			actualizarSolicitud() {
				this.preload = true
				this.limpiarError()
				this.$axios.post('tipo-solicitud-red-vital/actualizar', this.formularioSolicitud).then(res => {
					this.listarTipodeSolicitud()
					this.dialogoCrearSolicitud = false
					this.preload = false
					this.$toast.success(res.data)
				}).catch(error => {
					this.preload = false
					if (error.response.data.mensaje) {
						this.$toast.error(error.response.data.mensaje)
					} else if (error.response.data) {
						this.ErrorEntrada(error.response.data)
					}
				})
			},

			inactivarEmpleado(empleado) {
				this.preload = true
				this.$axios.post('tipo-solicitud-empleado/inactivar', {
					id_empleado: empleado.id,
					tipoSolicitud_id: this.formularioSolicitud.id
				}).then(res => {
					// this.listarTipodeSolicitud()
					this.dialogoCrearSolicitud = false
					this.preload = false
					this.$toast.success(res.data)
				}).catch(error => {
					this.preload = false
				})
			},

			limpiarFiltro() {
				for (const key in this.formulario) {
					this.formulario[key] = ''
				}
				this.listapendientes = null
			},

			filtrarPendientes() {
				this.preload = true
				this.limpiarErrorPendientes()
				this.$axios.post('radicacion-online/buscarPendientes',
					this.formulario).then(res => {
					this.listapendientes = res.data
					// this.total = res.data.last_page
					this.preload = false
				}).catch(e => {
					this.preload = false
					this.ErrorEntradaPendientes(e.response.data)
				})
			},

			limpiarErrorPendientes() {
				for (const key in this.errorsPendientes) {
					this.errorsPendientes[key] = ''
				}
			},

			ErrorEntradaPendientes(errors) {
				for (const key in this.errorsPendientes) {
					if (key in errors) {
						this.errorsPendientes[key] = errors[key].join(',')
					}
				}
			},

			comentariosPublico(id) {
				this.preload = true
				this.$axios.post('gestion-radicacion-online/verComentariosPublicos', {
					radicacion_id: id
				}).then(res => {
					this.comentarioPublico = res.data
					this.preload = false
				}).catch(e => {
					this.preload = false
				})
			},

			comentariosPrivados(id) {
				this.preload = true
				this.$axios.post('gestion-radicacion-online/verComentariosPrivados', {
					radicacion_id: id
				}).then(res => {
					this.comentarioPrivado = res.data
					this.preload = false
				}).catch(e => {
					this.preload = false
				})
			},

			devolucion(id) {
				this.preload = true
				this.$axios.post('gestion-radicacion-online/verDevoluciones', {
					radicacion_id: id
				}).then(res => {
					this.devoluciones = res.data
					this.preload = false
				}).catch(e => {
					this.preload = false
				})
			},

			async consultarAdjunto(ruta) {
				try {
					let adj = await this.$adjuntos(ruta);
					let blob = new Blob([adj[1]], {
						type: adj[0],
					});
					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					window.open(link.href, "_blank");
				} catch (error) {
					console.log(error.response);
				}
			},

			abrirPendiente(item) {
				this.pendientes = item
				this.comentariosPublico(item.id)
				this.comentariosPrivados(item.id)
				this.devolucion(item.id)
				this.dialogoAcciones = true
			},

			abrirGestion() {
				this.dialogGestion = true
			},

			cerrarGestion() {
				this.dialogGestion = false,
					this.seleccion = [],
					this.formularioGestion.alUsuario = '',
					this.formularioGestion.delUsuario = ''
				this.formularioGestion.usuarios = ''
				this.formularioGestion.tipo = '',
					this.formularioGestion.motivo = ''
			},

			guardarGestion() {
				this.preload = true
				let formData = new FormData();
				this.limpiarErrorGestion()
				formData.append('tipo', this.formularioGestion.tipo)
				formData.append('motivo', this.formularioGestion.motivo)
				if (this.seleccion.length >= 1) {
					for (let i = 0; i < this.seleccion.length; i++) {
						formData.append(`radicacion_online_id[]`, this.seleccion[i].id);
					}
				} else {
					formData.append(`radicacion_online_id`, null);
				}

				if (Array.isArray(this.formularioGestion.usuarios)) {
					for (let i = 0; i < this.formularioGestion.usuarios.length; i++) {
						formData.append(`usuario_id[]`, this.formularioGestion.usuarios[i]);
					}
				}
				if (Array.isArray(this.formularioGestion.delUsuario)) {
					for (let i = 0; i < this.formularioGestion.delUsuario.length; i++) {
						formData.append(`delusuario_id[]`, this.formularioGestion.delUsuario[i]);
					}
				}
				if (Array.isArray(this.formularioGestion.alUsuario)) {
					for (let i = 0; i < this.formularioGestion.alUsuario.length; i++) {
						formData.append(`alusuario_id[]`, this.formularioGestion.alUsuario[i]);
					}
				}

				this.$axios.post('gestion-radicacion-online/guardarGestion', formData).then(res => {
					this.filtrarPendientes()
					this.cerrarGestion()
					this.preload = false
				}).catch(e => {
					this.preload = false
					console.log(e);
					this.ErrorEntradaGestion(e.response.data)
				})
			},

			limpiarErrorGestion() {
				for (const key in this.errorsGestion) {
					this.errorsGestion[key] = ''
				}
			},

			ErrorEntradaGestion(errors) {
				for (const key in this.errorsGestion) {
					if (key in errors) {
						this.errorsGestion[key] = errors[key].join(',')
					}
				}
			},

			limpiarFiltroSolucionadas() {
				this.solucionadas.fechaDesde = '',
					this.solucionadas.fechaHasta = '',
					this.solucionadas.municipio = '',
					this.solucionadas.departamento = ''
				this.solucionadas.documento = '',
					this.solucionadas.tipoSolicitud = ''
			},

			filtrarSolucionadas() {
				this.preload = true
				this.limpiarErrorSolucionadas()
				this.$axios.post('radicacion-online/solucionadasAdmin?page=' + this.pagina + '&cantidad=' + this
					.opcionActual,
					this.solucionadas).then(res => {
					this.listaSolucionados = res.data.data
					this.total = res.data.last_page
					this.preload = false
				}).catch(e => {
					this.preload = false
					console.log(e.response);
					this.ErrorEntradaSolucionadas(e.response.data)
				})
			},

			limpiarErrorSolucionadas() {
				for (const key in this.errorsSolucionadas) {
					this.errorsSolucionadas[key] = ''
				}
			},

			ErrorEntradaSolucionadas(errors) {
				for (const key in this.errorsSolucionadas) {
					if (key in errors) {
						this.errorsSolucionadas[key] = errors[key].join(',')
					}
				}
			},

			abrirSolucionadas(item) {
				this.solucionados = item
				this.comentariosPublico(item.id)
				this.comentariosPrivados(item.id)
				this.devolucion(item.id)
				this.dialogoSolucionados = true
			},

			guardarArea() {
				this.$axios.post('/area-solicitudes/crear', this.formularioArea).then(res => {
					this.$toast.success('Creado con exito')
					this.dialogoCrearArea = false
					this.listarAreas()
				}).catch(error => {
					this.toast.error('Error al crear categoria')
				})
			},

			listarAreas() {
				this.loading = true
				this.$axios.post('area-solicitudes/listar').then(res => {
					this.listaAreas = res.data
					this.loading = false
				}).catch(e => {
					this.loading = false
					console.log(e);
					this.ErrorEntradaGestion(e.response.data)
				})

			},

			editarArea(datos) {
				// this.fetchAreas()

				this.datosArea = datos
				let prueba = datos.user.map((rep) => rep.operador.user_id)
				this.datosArea.user_id = prueba
				this.dialogEditarArea = true
			},

			actualizarArea(datos) {
				console.log(datos);
				const area = {
					id: datos.id,
					nombre: datos.nombre,
					user_id: datos.user_id,
				}
				this.$axios.put('/area-solicitudes/' + area.id, area).then(res => {
					this.dialogEditarArea = false
					this.$toast.success(res.data.mensaje)
					this.listarAreas()
				}).catch(error => {
					this.toast.error('Error al crear categoria')
				})
			},

			confirmacionCambioEstado(item) {
				this.$swal({
					title: "¿Está seguro?",
					text: "¿Desea cambiar el estado del tipo de solicitud?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
					confirmButtonText: "Cambiar estado",
					cancelButtonText: "Cancelar",

				}).then((result) => {
					if (result.value) {
						this.$axios
							.put(`/tipo-solicitud-red-vital/cambiarEstado/${item.id}`, {
								'activo': item.activo == true ? false : true,
							})
							.then(() => {
								this.$toast.success("Cambio de estado exitoso");
								this.listarTipodeSolicitud()
							})
							.catch((error) => {
								this.$toast.error("Ocurrió un error al cambiar el estado");
								console.log(error);
							})
							.finally(() => {});
					}
				});
			},

			cerrarModalConfirmacion() {
				this.dialogoEstado = false
				this.$nextTick(() => {
					this.item = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				})
			},

			listarEntidades() {
				this.$axios.get('entidad/listar').then(res => {
					this.listaEntidades = res.data
				}).catch(e => {
					console.log(e);
				})
			},

			obtenerEntidadesLimitadas(tipoSolicitud) {
				this.preload = true
				this.$axios.post('tipo-solicitud-entidad/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
					id: tipoSolicitud
				}).then(res => {
					this.entidadesRelacionadas = res.data.data
					this.total = res.data.last_page
					this.preload = false
				}).catch(e => {
					this.preload = false
				})
			},

		},
	};

</script>

<style lang="scss" scoped></style>
