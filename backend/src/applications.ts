
import { Router } from 'express';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import ddbDocClient from './dynamodb';

const router = Router();
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'JobApplications';

// List all applications

router.get('/', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const result = await ddbDocClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#uid = :uid',
      ExpressionAttributeNames: { '#uid': 'userId' },
      ExpressionAttributeValues: { ':uid': userId },
    }));
    res.json(result.Items || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err });
  }
});

// Create new application
router.post('/', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const id = `${userId}-${Date.now()}`;
    const app = { id, userId, ...req.body, createdAt: new Date().toISOString() };
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: app }));
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create application', details: err });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const id = req.params.id;
    const result = await ddbDocClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));
    if (!result.Item || result.Item.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.Item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch application', details: err });
  }
});

// Update application
router.put('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const id = req.params.id;
    // Only allow update if user owns the application
    const getResult = await ddbDocClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!getResult.Item || getResult.Item.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    // Build update expression and attributes
    const now = new Date().toISOString();
    const updateKeys = Object.keys(req.body);
    const exprNames: Record<string, string> = { '#updatedAt': 'updatedAt' };
    const exprValues: Record<string, any> = { ':updatedAt': now };
    let updateExpr = 'SET ';
    if (updateKeys.length > 0) {
      updateExpr += updateKeys.map(key => {
        exprNames[`#${key}`] = key;
        exprValues[`:${key}`] = req.body[key];
        return `#${key} = :${key}`;
      }).join(', ') + ', ';
    }
    updateExpr += '#updatedAt = :updatedAt';
    await ddbDocClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: exprNames,
      ExpressionAttributeValues: exprValues,
    }));
    res.json({ ...getResult.Item, ...req.body, updatedAt: now });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application', details: err });
  }
});

// Archive/Delete application
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    const id = req.params.id;
    const getResult = await ddbDocClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!getResult.Item || getResult.Item.userId !== userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    res.json({ archived: getResult.Item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete application', details: err });
  }
});

export default router;
