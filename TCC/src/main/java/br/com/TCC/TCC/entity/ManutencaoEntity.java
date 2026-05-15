package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Manutencao")
public class ManutencaoEntity  implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	private KitEntity kit;
	
	private String ordemServico;
	
	//id cliente
	@ManyToOne
	@JoinColumn (name = "idCliente")
	private ClienteEntity cliente;
	
	
	@ManyToOne
	@JoinColumn(name = "idMecanico")
	private UsuarioEntity mecanico;
	
	
	@ManyToOne
	@JoinColumn(name = "idAlmoxarife")
	private UsuarioEntity almoxarife;
	
	
	
	private String descricao;
	private String status;
	private LocalDate datacadastro;
	
	
	
	
	
	
	public KitEntity getKit() {
		return kit;
	}
	public void setKit(KitEntity kit) {
		this.kit = kit;
	}
	public UsuarioEntity getMecanico() {
		return mecanico;
	}
	public void setMecanico(UsuarioEntity mecanico) {
		this.mecanico = mecanico;
	}
	public UsuarioEntity getAlmoxarife() {
		return almoxarife;
	}
	public void setAlmoxarife(UsuarioEntity almoxarife) {
		this.almoxarife = almoxarife;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getOrdemServico() {
		return ordemServico;
	}
	public void setOrdemServico(String ordemServico) {
		this.ordemServico = ordemServico;
	}
	public ClienteEntity getCliente() {
		return cliente;
	}
	public void setCliente(ClienteEntity cliente) {
		this.cliente = cliente;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	
	
	
	public LocalDate getDatacadastro() {
		return datacadastro;
	}
	public void setDatacadastro(LocalDate datacadastro) {
		this.datacadastro = datacadastro;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
}
