# Straight A APIs

This is a collection of StraightA APIs. Nulis ini biar gak lupa wkkww

> Note: For headers that is prefixed with `[🛡️]` means they're
> protected (only logged-in users can access)

Every of these types are declared as a zod schema on the file `/app/api/schema.ts`.

GET requests' Request type is specified through the get parameters / search parameters.

### Generic Response error-handling type

```typescript
type ResponseResult<T> =
  | { status: "ok"; payload: T }
  | { status: "err"; reason: string };
```

The type above may be used on the following api response types to provide a unified .

> Small note: ResponseResult doesn't actually exist as a zod schema, it's defined as a function that takes a payload schema and wrap status around it.

### `/api/auth/login`

#### `POST`

```typescript
type Request = {
  username: string;
  password: string;
};

type Response = ResponseResult<{ redirect: string }>;
```

When status field is `ok`, a cookie will be set containing a JWT token

### `/api/auth/register`

#### `POST`

```typescript
type Request = {
  username: string;
  password: string;
};

type Response = ResponseResult<{ redirect: string }>;
```

When response's status field is `ok`, a cookie will be set containing a JWT token.

After a register action is done, the client must get redirected to the url given
on the `redirect` field. The redirect field will be the url of where the user will
get asked a series of questions regarding their preference. This is to ensure that
the user go through the questions flow before doing anything with the dashboard.

Although, the user will get redirected automatically by the middleware if they haven't
answered the questions yet.

### `[🛡️]` `/api/auth/logout`

#### `POST`

```typescript
type Request = {};

type Response = { status: "ok"; payload: { message: "Telah keluar" } };
```

Yes that's a concrete literal type, what do you expect lol.

### `[🛡️]` `/api/subject`

#### GET

Retrieve a specific subject with an id

```typescript
type Request = {
  id: number;
};

type Response = {
  title: string;
  overallScore: number;
  materials: number[]; // material ids
};
```

#### POST

Create a subject

```typescript
type Request = {
  title: string;
  subjectiveScore: number;
  objectiveScore?: number;
  materials?: string[];
};

type Response = {
  id: number;
};
```

### `[🛡️]` `/api/subject/list`

#### `GET`

```typescript
type Request = {
  limit: number; // must not exceed 100
  offset: number;
};

type Response = ResponseResult<
  {
    id: number;
    title: string;
    overallScore: number; // an overall score of the user's knowledge about this subject
  }[]
>;
```

### `[🛡️]` `/api/material`

#### `GET`

```typescript
type Request = {
  id: number;
};

type Response = ResponseResult<{
  id: number;
  title: string;
  overallScore: number; // an overall score of the user's knowledge about this material
  subjectId: number;
}>;
```

### `[🛡️]` `/api/material/list`

#### `GET`

```typescript
type Request = {
  subjectId: number;
  limit: number;
  offset: number;
};

type Response = ResponseResult<
  {
    id: number;
    title: string;
    overallScore: number; // an overall score of the user's knowledge about this material
    subjectId: number;
  }[]
>;
```

### `[🛡️]` `/api/study/new`

Creates a new studying session

#### `POST`

```typescript
type Request = {
  materialId: number;
};

type Response = ResponseResult<{
  id: number; // study session id
}>;
```

### `[🛡️]` `/api/study/end`

Stops a studying session, with parameters about how the study went.

Will fail if study time and break time does not match with the date the session was created
within the database.

Although, mungkin mereka bisa nge-cheat, tapi pada akhirnya, memang tujuan mereka untuk menggunakan
aplikasi ini untuk apa?

#### `POST`

```typescript
type Request = {
  id: number;
  time: {
    studyTime: number; // relative time in milliseconds
    breakTime: number; // relative time in milliseconds
  };
  score: number;
};

type Response = ResponseResult<{}>; // no payload
```

### `[🛡️]` `/api/study/cancel`

Cancels an ongoing study session. Will fail with 404 if a study session has already concluded.

#### `POST`

```typescript
type Request = {
  id: number;
};

type Response = ResponseResult<{ id: number }>; // no payload
```

### `[🛡️]` `/api/study/list`

#### `GET`

```typescript
type Request = {
  limit: number;
  offset: number;
};

type Response = ResponseResult<
  {
    from: number; // date in timestamp
    to: number; // date in timestamp
    materialId: number;
    // todo: growth etc
  }[]
>;
```
