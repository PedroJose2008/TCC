package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Kit")
public class KitEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "idPeca")
	private PecaEntity peca;
	
	@ManyToOne
	@JoinColumn(name = "idCliente")
	private ClienteEntity cliente;
	
	//tem que fazer o código aleatorio e não poder deixar o ususario mexer 
	private String codigo;
	private String nome;
	private String descricao;
	private LocalDate dataCadastro;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}

	
	
	
	public String getCodigo() {
		return codigo;
	}
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public LocalDate getDataCadastro() {
		return dataCadastro;
	}
	public void setDataCadastro(LocalDate dataCadastro) {
		this.dataCadastro = dataCadastro;
	}
	public PecaEntity getPeca() {
		return peca;
	}
	public void setPeca(PecaEntity peca) {
		this.peca = peca;
	}
	public ClienteEntity getCliente() {
		return cliente;
	}
	public void setCliente(ClienteEntity cliente) {
		this.cliente = cliente;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
}
