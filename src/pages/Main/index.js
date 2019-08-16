import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';
import api from '../services/api';

export default class Main extends Component {
    state = {
        newRepository: '',
        repositories: [],
        loading: false,
    };

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;
        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({
            newRepository: e.target.value,
        });
    };

    handleSubmit = async e => {
        e.preventDefault();
        const { newRepository, repositories } = this.state;

        this.setState({ loading: true });

        try {
            const response = await api.get(`/repos/${newRepository}`);

            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepository: '',
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false });
        }
    };

    render() {
        const { newRepository, repositories, loading } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepository}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={Boolean(loading)}>
                        {loading ? <FaSpinner color="#fff" size={14} /> : <FaPlus color="#fff" size={14} />}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repo => (
                        <li key={repo.name}>
                            <span>{repo.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repo.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
