import { test, expect } from '@playwright/test';

test.describe('Shortlink API integration tests (existing data)', () => {

  const existingFullShortUrl = 'http://shortlink.tus/2IkDwH';

  test('Update existing short link', async ({ request }) => {
    const response = await request.put('/api/shortlink/v1/links/update', {
      data: {
        fullShortUrl: existingFullShortUrl,
        originUrl: 'https://example.com/articles/hibernate-vs-jpa',
        originGid: 'test',
        gid: 'default',
        validDateType: 0,
        validDate: '2026-06-01 00:00:00',
        describe: 'Updated description for Hibernate-core-based short link'
      }
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toEqual({
      code: '0',
      message: null,
      data: null,
      requestId: null,
      success: true
    });
  });

  test('Page query short links', async ({ request }) => {
    const response = await request.post('/api/shortlink/v1/links/page', {
      data: {
        gid: 'default',
        orderTag: 'created_time_desc',
        pageNo: 1,
        pageSize: 10
      }
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body).toEqual({
      code: '0',
      message: null,
      data: {
        start: 0,
        page_size: 10,
        total: expect.any(Number),
        elements: expect.any(Array)
      },
      requestId: null,
      success: true
    });

    if (body.data.elements.length > 0) {
      const element = body.data.elements[0];
      expect(element).toMatchObject({
        id: expect.any(String),
        domain: expect.any(String),
        shortUri: expect.any(String),
        fullShortUrl: expect.any(String),
        originUrl: expect.any(String),
        gid: expect.any(String),
        validDateType: expect.any(Number),
        enableStatus: expect.any(Number),
        validDate: expect.any(String),
        createTime: expect.any(String),
        describe: expect.any(String)
      });
    }
  });

  test('Group short link count', async ({ request }) => {
    const response = await request.get(
      '/api/shortlink/v1/links/gcount?groupIds=default&groupIds=test'
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body).toEqual({
      code: '0',
      message: null,
      data: [
        {
          gid: 'default',
          shortLinkCount: expect.any(Number)
        },
        {
          gid: 'test',
          shortLinkCount: expect.any(Number)
        }
      ],
      requestId: null,
      success: true
    });
  });
});