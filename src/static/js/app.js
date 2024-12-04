function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col>
                    <TodoListCard />
                </Col>
                <Col>
                    <AvailCard />
                </Col>
                <Col>
                    <MatchesCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items/Gamers', {method: "GET"})
            .then(r => r.json())
            .then(setItems)
            .then(() => {
                console.log(items);
            });
    }, []);
   
    
    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} table="Gamers" />
            {items.length === 0 && (
                <p className="text-center">Oopsies</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    table="Gamers"
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AvailCard(){
    const [itemsAvail, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items/AvailWindow', {method: "GET"})
            .then(r => r.json())
            .then(setItems)
            .then(() => {
                console.log(itemsAvail);
            });
    }, []);
   
    
    const onNewItem = React.useCallback(
        newItem => {
            setItems([...itemsAvail, newItem]);
        },
        [itemsAvail],
    );

    const onItemUpdateAvail = React.useCallback(
        item => {
            const index = itemsAvail.findIndex(i => i.id === item.id);
            setItems([
                ...itemsAvail.slice(0, index),
                item,
                ...itemsAvail.slice(index + 1),
            ]);
        },
        [itemsAvail],
    );

    const onItemRemovalAvail = React.useCallback(
        item => {
            const index = itemsAvail.findIndex(i => i.id === item.id);
            setItems([...itemsAvail.slice(0, index), ...itemsAvail.slice(index + 1)]);
        },
        [itemsAvail],
    );

    if (itemsAvail === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} table="AvailWindow" />
            {itemsAvail.length === 0 && (
                <p className="text-center">Oopsies</p>
            )}
            {itemsAvail.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    table="AvailWindow"
                    onItemUpdate={onItemUpdateAvail}
                    onItemRemoval={onItemRemovalAvail}
                />
            ))}
        </React.Fragment>
    );
}

function MatchesCard(){
    const [itemsMatches, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items/Matches', {method: "GET"})
            .then(r => r.json())
            .then(setItems)
            .then(() => {
                console.log(itemsMatches);
            });
    }, []);
   
    
    const onNewItem = React.useCallback(
        newItem => {
            setItems([...itemsMatches, newItem]);
        },
        [itemsMatches],
    );

    const onItemUpdateMatches = React.useCallback(
        item => {
            const index = itemsMatches.findIndex(i => i.id === item.id);
            setItems([
                ...itemsMatches.slice(0, index),
                item,
                ...itemsMatches.slice(index + 1),
            ]);
        },
        [itemsMatches],
    );

    const onItemRemovalMatches = React.useCallback(
        item => {
            const index = itemsMatches.findIndex(i => i.id === item.id);
            setItems([...itemsMatches.slice(0, index), ...itemsMatches.slice(index + 1)]);
        },
        [itemsMatches],
    );

    if (itemsMatches === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} table="Matches" />
            {itemsMatches.length === 0 && (
                <p className="text-center">Oopsies</p>
            )}
            {itemsMatches.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    table="Matches"
                    onItemUpdate={onItemUpdateMatches}
                    onItemRemoval={onItemRemovalMatches}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem, table }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch(`/items/${table}`, {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, table, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const removeItem = () => {
        fetch(`/items/${table}/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={10} className="name">
                    {item.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
